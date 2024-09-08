import mysql.connector
import json

# Load subcategories data from JSON file
with open('/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/subcat.json', 'r') as file:
    subcategories_data = json.load(file)

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="sahil",
    password="101202",
    database="software_engineering"
)
cursor = conn.cursor()

# Fetch main category IDs from the 'category' table
category_ids = {}
cursor.execute("SELECT id, category_name FROM product_category")
for (id, name) in cursor.fetchall():
    category_ids[name.lower()] = id

# Insert subcategories into the 'product' table
for category in subcategories_data:
    main_category_name = category['main_category'].lower()
    if main_category_name in category_ids:
        main_category_id = category_ids[main_category_name]
        for subcategory in category['subcategories']:
            insert_query = '''
            INSERT INTO product (category_id, name)
            VALUES (%s, %s)
            '''
            cursor.execute(insert_query, (main_category_id, subcategory))

# Commit and close
conn.commit()
cursor.close()
conn.close()
