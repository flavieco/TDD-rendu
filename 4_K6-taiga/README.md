# 4 - Tests de charge (k6)

Tests de performance sur l'API Taiga avec [k6](https://k6.io/).

## Contenu

- `tests/load-test.js` — scénarios de charge
- `modules/auth.js` — authentification et gestion des headers
- `modules/issues.js` — appels API (CRUD issues)
- `scripts/` — scripts utilitaires

## Scénarios

| Scénario | VUs | Durée |
|---|---|---|
| Consultation | 15 | 3 min |
| Création | 3 | 3 min |
| Modification | à définir | 3 min |

## Lancer les tests

```bash
k6 run tests/load-test.js
```
