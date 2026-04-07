class Checkout:
    def __init__(self):
        self.prices = {}
        self.products = []
        self.discounts = {}

    def add_price(self, item, price):
        self.prices[item] = price

    def add_product(self, item):
        if item not in self.prices:
            raise Exception(f"No price defined for: {item}")
        self.products.append(item)

    def get_total_price(self):
        total_price = 0
        for product in self.products:
            if product in self.discounts:
                discount = self.discounts[product]
                price = discount(self.prices[product])
            else:
                price = self.prices[product]
            total_price += price
        return total_price
    
    def add_discount(self, item, discount):
        self.discounts[item] = discount