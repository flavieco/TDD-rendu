# 3 - Automatisation Web (Playwright)

Tests end-to-end sur l'interface Taiga avec [Playwright](https://playwright.dev/).

## Contenu

- `tests/taiga_workflow.spec.ts` — scénario complet de gestion d'issues
- `issues.json` — jeu de données pour les tests
- `playwright.config.ts` — configuration Playwright

## Fonctionnalités testées

- Connexion à Taiga
- Création d'issues en masse depuis un fichier JSON
- Interaction avec les formulaires et dropdowns de l'interface

## Installation et lancement

```bash
npm install
npx playwright test
```
