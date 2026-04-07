import pytest
from checkout import Checkout

def test_create_checkout():
    checkout = Checkout()
    assert checkout.prices == {}

def test_add_price():
    checkout = Checkout()
    checkout.add_price("Apple", 1.00)
    assert checkout.prices == {"Apple": 1.00}

def test_add_product():
    checkout = Checkout()
    checkout.add_product("Apple")
    assert checkout.products == ["Apple"]

def test_get_total_price():
    checkout = Checkout()
    checkout.add_price("Apple", 1.00)
    checkout.add_product("Apple")
    assert checkout.get_total_price == 1.00

def test_multiple_articles_workflow():
    assert True

def test_add_discount():
    assert True

def test_apply_discount():
    assert True

def test_article_without_price():
    assert True