# Generate fake user data for orders
import random
from faker import Faker

fake = Faker()

def generate_fake_user_data(num_users):
    users = []
    for _ in range(num_users):
        name = fake.name()
        email = fake.email()
        address = fake.address()
        payment_info = fake.credit_card_full()
        users.append({
            'name': name,
            'email': email,
            'address': address,
            'payment_info': payment_info
        })
    return users

# Generate fake user data
num_users = 20
users = generate_fake_user_data(num_users)