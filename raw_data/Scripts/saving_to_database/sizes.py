import mysql.connector

# Establish the database connection
conn = mysql.connector.connect(
    host="localhost",
    user="sahil",
    password="101202",
    database="software_engineering"
)

cursor = conn.cursor()

# Define the list of sizes you want to add as variations
sizes = ["Small", "Medium", "Large", "X-Large"]

# Fetch the list of products and their category_ids
cursor.execute("SELECT id, product_id FROM product_item")  # Adjust this query based on your actual table name
products = cursor.fetchall()
print(products)
# Insert the variations for each product
for product in products:
    product_id = product[0]
    category_id = product[1]
    
    # Insert a new variation entry into the 'variation' table
    cursor.execute("INSERT INTO variation (category_id, name) VALUES (%s, %s)", (category_id, 'Size'))
    variation_id = cursor.lastrowid
    
    # Insert the corresponding size options into the 'variation_option' table
    for size in sizes:
        cursor.execute("INSERT INTO variation_option (variation_id, value) VALUES (%s, %s)", (variation_id, size))

# Commit the transaction
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Size variations added successfully.")
