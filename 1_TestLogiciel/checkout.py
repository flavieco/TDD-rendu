class Checkout:
    def __init__(self):
        self.prices = {}
        self.products = []

    def add_price(self, item, price):
        self.prices[item] = price

    def add_product(self, item):
        self.products.append(item)

    def get_total_product_price(self):
        total_price = 0