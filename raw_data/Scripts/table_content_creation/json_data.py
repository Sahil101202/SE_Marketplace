import json
import random
from datetime import datetime, timedelta

# Helper functions
def get_user(user_id):
    return {
        "siteuserid": user_id,
        "email_address": f"user{user_id}@example.com",
        "phone_number": f"{random.randint(100,999)}-555-{random.randint(1000,9999)}",
        "password": f"hashed_password_{user_id}"
    }

def generate_cart( user_id):
    return {
        "user_id": user_id
    }

def generate_order(user_id, address_id, payment_method_id, shipping_method_id, order_status_id):
    order_date = datetime.now() - timedelta(days=random.randint(1, 30))
    return {
        "user_id": user_id,
        "order_date": order_date.isoformat(),
        "payment_method_id": payment_method_id,
        "shipping_address": address_id,
        "shipping_method": shipping_method_id,
        "order_total": round(random.uniform(20.0, 500.0), 2),
        "order_status": order_status_id
    }

def generate_cart_item(cart_id, product_item_id):
    return {
        "cart_id": cart_id,
        "product_item_id": product_item_id,
        "qty": random.randint(1, 5)
    }

def generate_user_paymentmethod(payment_method_id, user_id, payment_type_id):
    return {
        "id": payment_method_id,
        "user_id": user_id,
        "payment_type_id": payment_type_id,
        "provider": random.choice(["Visa", "MasterCard", "PayPal"]),
        "account_number": f"{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}",
        "expiry_date": f"{random.randint(2024, 2030)}-{random.randint(1, 12):02}",
        "is_default": random.choice([True, False])
    }

def generate_address(address_id, user_id):
    return {
        "addressid": address_id,
        "unit_number": f"{random.randint(1, 20)}{random.choice(['A', 'B', 'C'])}",
        "streetnumber": f"{random.randint(100, 9999)}",
        "address_line1": f"{random.choice(['Main St', 'Second St', 'Broadway'])}",
        "address_line2": f"Apt {random.randint(1, 50)}",
        "city": random.choice(["Springfield", "Rivertown", "Greenville"]),
        "region": random.choice(["CA", "NY", "IL"]),
        "postal_code": f"{random.randint(10000, 99999)}",
        "country_id": 1
    }

def generate_country(country_id):
    return {
        "countryid": country_id,
        "country_name": "United States"
    }

def generate_order_status(order_status_id, status):
    return {
        "id": order_status_id,
        "status": status
    }

def generate_payment_type(payment_type_id, value):
    return {
        "id": payment_type_id,
        "value": value
    }

def generate_shipping_method(shipping_method_id, name, price):
    return {
        "id": shipping_method_id,
        "name": name,
        "price": price
    }

def generate_user_review(review_id, user_id, ordered_product_id):
    return {
        "id": review_id,
        "user_id": user_id,
        "ordered_product_id": ordered_product_id,
        "rating_value": random.randint(1, 5),
        "comment": random.choice(["Great product!", "Not bad", "Would not recommend", "Excellent!"])
    }

def generate_promotion_category(category_id, promotion_id):
    return {
        "category_id": category_id,
        "promotion_id": promotion_id
    }

def generate_promotion(promotion_id):
    start_date = datetime.now() - timedelta(days=random.randint(1, 60))
    end_date = start_date + timedelta(days=random.randint(1, 30))
    return {
        "promotionid": promotion_id,
        "name": f"Promo {promotion_id}",
        "description": f"Description for promotion {promotion_id}",
        "discount_rate": random.randint(10, 50),
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat()
    }

def generate_product_configuration(product_item_id, variation_option_id):
    return {
        "product_item_id": product_item_id,
        "variation_option_id": variation_option_id
    }

def generate_variation_option(option_id, variation_id, value):
    return {
        "id": option_id,
        "variation_id": variation_id,
        "value": value
    }

def generate_variation(variation_id, category_id, name):
    return {
        "id": variation_id,
        "category_id": category_id,
        "name": name
    }

# Generate data for 100 instances
users = [get_user(i) for i in range(5, 1005)]
carts = [generate_cart(random.choice(users)["siteuserid"]) for i in range(1, 850)]
orders = [generate_order(random.choice(users)["siteuserid"], random.randint(1, 100), random.randint(1, 3), random.randint(1, 2), random.randint(1, 4)) for i in range(1, 151)]
cart_items = [generate_cart_item(random.choice(carts)["id"], random.randint(1, 50)) for _ in range(100)]
user_paymentmethods = [generate_user_paymentmethod(i, random.choice(users)["siteuserid"], random.randint(1, 3)) for i in range(1, 101)]
addresses = [generate_address(i, random.choice(users)["siteuserid"]) for i in range(1, 101)]
countries = [generate_country(1)]
order_statuses = [generate_order_status(i, status) for i, status in enumerate(["Pending", "Shipped", "Delivered", "Cancelled"], 1)]
payment_types = [generate_payment_type(i, value) for i, value in enumerate(["Credit Card", "PayPal", "Bank Transfer"], 1)]
shipping_methods = [generate_shipping_method(i, name, price) for i, (name, price) in enumerate([("Standard Shipping", 5.00), ("Express Shipping", 15.00)], 1)]
user_reviews = [generate_user_review(i, random.choice(users)["siteuserid"], random.randint(1, 150)) for i in range(1, 151)]
promotion_categories = [generate_promotion_category(random.randint(1, 10), random.randint(1, 5)) for _ in range(25)]
promotions = [generate_promotion(i) for i in range(1, 6)]
product_configurations = [generate_product_configuration(random.randint(1, 50), random.randint(1, 10)) for _ in range(25)]
variation_options = [generate_variation_option(i, random.randint(1, 2), value) for i, value in enumerate(["Red", "Blue", "Small", "Medium", "Large"], 1)]
variations = [generate_variation(i, random.randint(1, 5), name) for i, name in enumerate(["Color", "Size"], 1)]

# Compile all data
data_100 = {
    "users": users,
    "shopping_cart": carts,
    "shop_order": orders,
    "shopping_cart_item": cart_items,
    "user_paymentmethod": user_paymentmethods,
    "user_address": addresses,
    "country": countries,
    "order_status": order_statuses,
    "payment_type": payment_types,
    "shipping_method": shipping_methods,
    "user_review": user_reviews,
    "promotion_category": promotion_categories,
    "promotion": promotions,
    "product_configuration": product_configurations,
    "variation_option": variation_options,
    "variation": variations
}

print(data_100)

# # Save to a JSON file
# with open("ecommerce_data_100.json", "w") as file:
#     json.dump(data_100, file, indent=4)

# print("Data generation complete. File saved as ecommerce_data_100.json")
