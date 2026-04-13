import { test, expect, Page } from '@playwright/test';
import issues from '../issues.json';

async function dismissLightbox(page: Page) {
  await page.locator('.lightbox-create-edit').evaluate(el => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.display = 'none';
    htmlEl.classList.remove('open');
  });
}

async function openNewIssueForm(page: Page) {
  await page.locator('.lightbox-create-edit').evaluate(el => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.display = '';
    htmlEl.classList.remove('open');
  });
  await page.evaluate(() =>
    (document.querySelector('[ng-click*="addNewIssue"]') as HTMLElement)?.click()
  );
}

async function selectDropdown(page: Page, openerSelector: string, popupSelector: string, value: string) {
  await page.evaluate((sel) => {
    const lb = document.querySelector('.lightbox-create-edit');
    (lb?.querySelector(sel) as HTMLElement)?.click();
  }, openerSelector);

  await page.evaluate(({ popup, val }) => {
    const lb = document.querySelector('.lightbox-create-edit');
    const options = lb?.querySelectorAll(`${popup} a`) || [];
    for (const opt of Array.from(options)) {
      if (opt.textContent?.includes(val)) {
        (opt as HTMLElement).click();
        return;
      }
    }
  }, { popup: popupSelector, val: value });
}

async function fillAndCreateIssue(page: Page, issue: { subject: string; description: string; type: string; severity: string; priority: string }) {
  const form = page.locator('.lightbox-create-edit');

  await form.getByRole('textbox', { name: 'Subject' }).fill(issue.subject);
  await form.getByRole('textbox', { name: 'Please add descriptive text' }).fill(issue.description);

  await selectDropdown(page, '.type-data', 'ul.pop-type', issue.type);
  await selectDropdown(page, '.severity-data.clickable', 'ul.pop-severity', issue.severity);
  await selectDropdown(page, '.priority-data.clickable', 'ul.pop-priority', issue.priority);

  await form.getByRole('button', { name: 'Create' }).click();
  await page.waitForLoadState('networkidle');
}

test('Taiga issue workflow: create, filter, search, and delete', async ({ page }) => {
  await page.goto('https://tree.taiga.io/discover');

  // LOGIN
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username or email (case' }).fill('mayayousfi');
  await page.getByRole('textbox', { name: 'Password (case sensitive)' }).fill('.h!E7D8rGKuph9e');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Projects Dashboard')).toBeVisible();

  // DISMISS COOKIE BANNER
  await page.evaluate(() => {
    document.querySelector('cookie-warning')?.remove();
  });

  // SELECT PROJECT
  await page.getByText("TDD C'est l'électif de TDD 0 2").click();
  await expect(page.getByText("C'est l'électif de TDD")).toBeVisible();

  // SEE ALL ISSUES
  await page.getByRole('link', { name: /Issues/i }).click();
  await expect(page.getByRole('button', { name: 'NEW ISSUE' })).toBeVisible();

  // CREATE TEST ISSUE
  await page.getByRole('button', { name: 'NEW ISSUE' }).click();
  await fillAndCreateIssue(page, { subject: 'Test', description: 'TEST', type: 'Bug', severity: 'Critical', priority: 'Low' });
  const testIssueLink = page.getByRole('link', { name: /^#\d+ Test$/ }).first();
  await expect(testIssueLink).toBeVisible();
  const issueNumber = (await testIssueLink.innerText()).match(/#(\d+)/)?.[1];
  await dismissLightbox(page);

  // CREATE ISSUES FROM JSON DATA
  for (const issue of issues) {
    await openNewIssueForm(page);
    await fillAndCreateIssue(page, issue);
  }
  await dismissLightbox(page);

  // FILTER
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Type' }).click();
  await page.getByRole('button', { name: 'Bug' }).click();
  await page.getByRole('button', { name: 'Severity' }).click();
  await page.getByRole('button', { name: 'Critical' }).click();
  await expect(page.getByText('Test', { exact: true }).first()).toBeVisible();

  // SEARCH BY REFERENCE
  await page.getByRole('searchbox', { name: 'subject or reference' }).fill('Test');
  await expect(page.getByText('Test', { exact: true }).first()).toBeVisible();

  // DELETE
  await page.getByRole('link', { name: `#${issueNumber} Test` }).click();
  await page.locator('button.button-delete').click();
  await page.getByRole('button', { name: 'DELETE' }).click();
  await expect(page.getByRole('link', { name: `#${issueNumber} Test` })).not.toBeVisible();
});
