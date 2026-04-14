# 2 - Tests Web Service (Bruno)

## Lancer les tests

**1. Installer les dépendances Python**

```bash
pip install fastapi uvicorn pandas
```

**2. Lancer le serveur FastAPI**

```bash
cd ../utils_bruno
python csv2api.py
```

Le serveur démarre sur `http://localhost:3000`.

**3. Lancer les tests Bruno**

Ouvrir la collection `opencollection.yml` dans Bruno et exécuter les requêtes.
