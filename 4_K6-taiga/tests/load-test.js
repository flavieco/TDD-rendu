import { sleep } from 'k6';
import { login, getHeaders } from '../modules/auth.js';
import { listIssues, createIssue, updateIssue, searchIssue, deleteIssue } from '../modules/issues.js';

const USERNAME = 'flavieco';
const PASSWORD = '123';

export const options = {
  scenarios: {
    consultation: {
      executor: 'ramping-vus',
      exec: 'parcours_consultation',
      stages: [
        { duration: '30s', target: 15 },
        { duration: '2m', target: 15 },
        { duration: '30s', target: 0 },
      ],
    },
    creation: {
      executor: 'ramping-vus',
      exec: 'parcours_creation',
      stages: [
        { duration: '30s', target: 3 },
        { duration: '2m', target: 3 },
        { duration: '30s', target: 0 },
      ],
    },
    modification: {
      executor: 'ramping-vus',
      exec: 'parcours_modification',
      stages: [
        { duration: '30s', target: 1 },
        { duration: '2m', target: 1 },
        { duration: '30s', target: 0 },
      ],
    },
    suppression: {
      executor: 'ramping-vus',
      exec: 'parcours_suppression',
      stages: [
        { duration: '30s', target: 1 },
        { duration: '2m', target: 1 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

// Parcours a (75%) : Login → Issues List → Search Issue → Logout
export function parcours_consultation() {
  const token = login(USERNAME, PASSWORD);
  const headers = getHeaders(token);
  sleep(1);

  listIssues(headers);
  sleep(1);

  searchIssue(headers, 'test');
  sleep(1);
}

// Parcours b (15%) : Login → Issues List → Create Issue → Logout
export function parcours_creation() {
  const token = login(USERNAME, PASSWORD);
  const headers = getHeaders(token);
  sleep(1);

  listIssues(headers);
  sleep(1);

  createIssue(headers, `Issue ${Date.now()}`, 'Description test', 3, 3, 1);
  sleep(1);
}

// Parcours c (10%) : Login → Issues List → Update Issue → Logout
export function parcours_modification() {
  const token = login(USERNAME, PASSWORD);
  const headers = getHeaders(token);
  sleep(1);

  listIssues(headers);
  sleep(1);

  // On crée d'abord une issue puis on la met à jour
  const issueId = createIssue(headers, `Issue à modifier ${Date.now()}`, 'Description test', 3, 3, 1);
  sleep(1);

  updateIssue(headers, issueId);
  sleep(1);
}

// Parcours d (10%) : Login → Issues List → Search Issue → Delete Issue → Logout
export function parcours_suppression() {
  const token = login(USERNAME, PASSWORD);
  const headers = getHeaders(token);
  sleep(1);

  listIssues(headers);
  sleep(1);

  const issueId = createIssue(headers, `Issue à supprimer ${Date.now()}`, 'Description test', 3, 3, 1);
  sleep(1);

  deleteIssue(headers, issueId);
  sleep(1);
}


