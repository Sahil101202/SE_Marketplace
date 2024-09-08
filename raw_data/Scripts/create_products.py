import random
import json

# Provided category data with manual IDs
category_data = [
    {
        "main_category": "Men",
        "subcategories": ["T-Shirts", "Jeans", "Jackets", "Suits", "Sweaters", "Shorts", "Polo Shirts", "Hoodies"]
    },
    {
        "main_category": "Women",
        "subcategories": ["Dresses", "Skirts", "Trousers", "Sweaters", "Jeans", "Tops", "Cardigans"]
    },
    {
        "main_category": "Kids",
        "subcategories": ["T-Shirts", "Shorts", "Jackets", "Dresses", "Pajamas", "Sweaters", "Jeans"]
    }
]

# Manual ID mappings for main categories
main_category_id_mapping = {
    "Men": 1,
    "Women": 2,
    "Kids": 3
}

# Manual ID mappings for subcategories starting from 14
subcategory_id_mapping = {}
subcategory_start_id = 14
for data in category_data:
    subcategory_mapping = {}
    for subcategory in data["subcategories"]:
        subcategory_mapping[subcategory] = subcategory_start_id
        subcategory_start_id += 1
    subcategory_id_mapping[data["main_category"]] = subcategory_mapping

descriptions = {
    "T-Shirts": "High-quality cotton T-shirt.",
    "Jeans": "Stylish and comfortable jeans.",
    "Jackets": "Warm and trendy jacket.",
    "Suits": "Elegant and professional suit.",
    "Sweaters": "Cozy and fashionable sweater.",
    "Shorts": "Light and comfortable shorts.",
    "Polo Shirts": "Classic and stylish polo shirt.",
    "Hoodies": "Warm and trendy hoodie.",
    "Dresses": "Elegant evening dress.",
    "Skirts": "Stylish and comfortable skirt.",
    "Trousers": "Elegant and comfortable trousers.",
    "Tops": "Fashionable and comfortable top.",
    "Cardigans": "Warm and trendy cardigan.",
    "Pajamas": "Comfortable pajamas for a good night's sleep."
}

# Read vendor data from JSON file
with open('/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/sellers.json', 'r') as file:
    vendors = json.load(file)

# Function to generate a random price
def generate_price():
    return round(random.uniform(10.0, 100.0), 2)

# Function to generate a random quantity
def generate_quantity():
    return random.randint(10, 200)

# Function to generate a product ID based on main category and subcategory
def generate_product_id(main_category, subcategory):
    subcategory_id = subcategory_id_mapping[main_category][subcategory]
    product_id = f"{subcategory_id}"
    return product_id

# Function to generate unique product names
def generate_unique_name(main_category, subcategory, vendor_name):
    return f"{vendor_name} {main_category} {subcategory}"

# Function to generate products for a vendor
def generate_products(vendor):
    vendor_id = vendors.index(vendor) + 2
    num_products = random.randint(1, 30)
    products = []

    for _ in range(num_products):
        main_category = random.choice(list(main_category_id_mapping.keys()))
        subcategory = random.choice(list(subcategory_id_mapping[main_category].keys()))
        product_id = generate_product_id(main_category, subcategory)
        unique_name = generate_unique_name(main_category, subcategory, vendor["name"])
        product = {
            "product_id": product_id,
            "name": unique_name,
            "quantity": generate_quantity(),
            "price": generate_price(),
            "description": descriptions[subcategory],
            "product_image": 0
        }
        products.append(product)
    
    return {
        "vendor_id": vendor_id,
        "vendor_name": vendor["name"],
        "products": products
    }

# Generate products for all vendors
all_products = [generate_products(vendor) for vendor in vendors]

# Save to JSON file
with open('/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/products.json', 'w') as file:
    json.dump(all_products, file, indent=4)

print("Product data generated and saved to products.json")
