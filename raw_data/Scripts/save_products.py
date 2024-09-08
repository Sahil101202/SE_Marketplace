import mysql.connector
import json

# Load product data from JSON file
with open('/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/products.json', 'r') as file:
    products_data = json.load(file)

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="sahil",
    password="101202",
    database="software_engineering"
)
cursor = conn.cursor()

# Insert products into the 'product_item' table
for vendor in products_data:
    vendor_id = vendor['vendor_id']
    for product in vendor['products']:
        insert_query = '''
        INSERT INTO product_item (id, product_id, name, quantity, product_image, price, seller_id, description)
        VALUES (NULL, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(insert_query, (
            product['product_id'],
            product['name'],
            product['quantity'],
            product['product_image'],
            product['price'],
            vendor_id,
            product['description']
        ))

# Commit and close
conn.commit()
cursor.close()
conn.close()
