import random
from faker import Faker
import mysql.connector
import json

# MySQL database connection details
host = 'localhost'
user = 'sahil'
password = '101202'
database = 'software_engineering'

# Table name in phpMyAdmin to save the data
table_name = 'product_item'

# Connect to the MySQL database
connection = mysql.connector.connect(host=host,user=user,password=password,database=database)
cursor = connection.cursor()

#retriving the id of the sub-products
query = "SELECT id, name FROM product"
cursor.execute(query)
prod_sub_cat = cursor.fetchall()

fake = Faker()

# Define product categories and types
categories = ['Men', 'Women', 'Kid']
types = {
    'Men': ['T-shirt', 'Pant', 'Jacket', 'Shoes'],
    'Women': ['T-shirt', 'Top', 'Skirt', 'Shoes'],
    'Kid': ['T-shirt', 'Pant', 'Shoes']
}

names = {
  "Jacket": [
    "Field Jacket",
    "Bomber Jacket",
    "Denim Jacket",
    "Leather Jacket",
    "Parka",
    "Blazer",
    "Rain Coat",
    "Windbreaker",
    "Motorcycle Jacket",
    "Pea Coat"
  ],
  "Pant": [
    "Chino Pants",
    "Cargo Pants",
    "Denim Jeans",
    "Khaki Pants",
    "Jogger Pants",
    "Slim Fit Pants",
    "Track Pants",
    "Trousers",
    "Leggings",
    "Sweatpants"
  ],
  "Shoes": [
    "Sneakers",
    "Boots",
    "Loafers",
    "Sandals",
    "Flats",
    "Heels",
    "Oxfords",
    "Athletic Shoes",
    "Espadrilles",
    "Mules"
  ],
  "Skirt": [
    "A-Line Skirt",
    "Pleated Skirt",
    "Midi Skirt",
    "Maxi Skirt",
    "Wrap Skirt",
    "Pencil Skirt",
    "Flared Skirt",
    "Denim Skirt",
    "Ruffle Skirt",
    "High-Waisted Skirt"
  ],
  "Top": [
    "Blouse",
    "T-Shirt",
    "Tank Top",
    "Crop Top",
    "Button-Up Top",
    "Peplum Top",
    "Off-Shoulder Top",
    "Halter Top",
    "Camisole",
    "Wrap Top"
  ],
  "T-shirt": [
    "Classic Tee",
    "Graphic Tee",
    "Printed Tee",
    "Vintage Tee",
    "Distressed Tee",
    "Pocket Tee",
    "Striped Tee",
    "Solid Tee",
    "Retro Tee",
    "Casual Tee"
  ]
}


# Generate fake product data
def generate_fake_products(categories, types, names):
    products = []
    for category in categories:
        for type in types[category]:
            for name in names[type]:
                product_name = f"{category}'s {name}"
                price = round(random.uniform(10, 1000), 2)
                quantity = random.randint(0, 100)
                variants = random.choice(['Size', 'Color', 'Style', None])
                image_url = fake.image_url(width=400, height=400)
                for j in prod_sub_cat:
                  if j[1] == f"{category}'s {type}":
                      id = j[0]
                products.append({
                    'product_id': id,
                    'name': product_name,
                    'price': price,
                    'quantity': quantity,
                    'product_image': 0
                })
    return products

products = generate_fake_products(categories, types, names)

# Specify the file path where you want to save the JSON file
file_path = "/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/json_data/product.json"

# Write JSON data to the file
with open(file_path, "w") as json_file:
    json_data = json.dumps(products, indent=4) 
    json_file.write(json_data)
    print(f"JSON data has been saved to {file_path}")


