# 1 - Test Logiciel (TDD)

Implémentation d'un système de caisse en Python suivant la méthode TDD.

## Contenu

- `checkout.py` — classe `Checkout` : gestion des prix, produits et remises
- `checkout_test.py` — tests unitaires avec pytest

## Fonctionnalités testées

- Ajout de prix et de produits
- Calcul du prix total
- Application de remises (via lambda)
- Gestion des erreurs (produit sans prix)

## Lancer les tests

```bash
pytest checkout_test.py
```
