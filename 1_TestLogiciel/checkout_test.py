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
    checkout.add_price("Apple", 1.00)
    checkout.add_product("Apple")
    assert checkout.products == ["Apple"]

def test_get_total_price():
    checkout = Checkout()
    checkout.add_price("Apple", 1.00)
    checkout.add_product("Apple")
    assert checkout.get_total_price() == 1.00

def test_multiple_articles_workflow():
    checkout = Checkout()
    checkout.add_price("Apple", 1.00)
    checkout.add_price("Banana", 3.00)
    checkout.add_product("Apple")
    checkout.add_product("Apple")
    checkout.add_product("Banana")
    assert checkout.get_total_price() == 5.00

def test_add_discount():
    checkout = Checkout()
    checkout.add_discount("Apple", lambda x: x * 0.9)
    assert checkout.discounts["Apple"](1.00) == 0.90

def test_apply_discount():
    checkout = Checkout()
    checkout.add_price("Apple", 1.00)
    checkout.add_price("Banana", 3.00)
    checkout.add_product("Apple")
    checkout.add_product("Apple")
    checkout.add_product("Banana")
    checkout.add_discount("Apple", lambda x: x * 0.9)
    assert checkout.get_total_price() == 4.80

def test_article_without_price():
    checkout = Checkout()
    with pytest.raises(Exception):
        checkout.add_product("Apple")