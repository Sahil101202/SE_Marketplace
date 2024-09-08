# Generate fake order history
# Generate fake user data for orders
import random
from faker import Faker

fake = Faker()

def generate_fake_orders(users, products, num_orders):
    orders = []
    for _ in range(num_orders):
        user = random.choice(users)
        product = random.choice(products)
        quantity = random.randint(1, 5)
        total_price = product['price'] * quantity
        orders.append({
            'user': user,
            'product': product,
            'quantity': quantity,
            'total_price': total_price
        })
    return orders


# Generate fake orders
num_orders = 100
orders = generate_fake_orders(users, products, num_orders)