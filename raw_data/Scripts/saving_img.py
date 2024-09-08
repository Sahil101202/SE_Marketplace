import mysql.connector
import os

# MySQL database connection details
host = 'localhost'
user = 'sahil'
password = '101202'
database = 'software_engineering'
table_name = 'product_item'

# Connect to the MySQL database
connection = mysql.connector.connect(host=host, user=user, password=password, database=database)
cursor = connection.cursor()

# Path to the single image to be used for all products
image_path = "/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/src/Frontend/admin/assets/images/Unime.png"

# Open the image file in binary mode
with open(image_path, "rb") as file:
    # Read the binary data from the image file
    image_data = file.read()

# SQL statement to update product_image column for all products
sql = f"UPDATE {table_name} SET product_image = %s"

# Execute the SQL statement with the image data
cursor.execute(sql, (image_data,))

# Commit the transaction
connection.commit()

# Close the cursor and connection
cursor.close()
connection.close()

print("All products have been updated with the new image.")
