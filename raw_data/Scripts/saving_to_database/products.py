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
# Path to the JSON file
json_file = '/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/product.json'

try:
    # Open the JSON file
    with open(json_file) as file:
        data = json.load(file)
        # Create a cursor object to execute SQL queries
        cursor = connection.cursor()
        # Iterate through the rows and insert them into the table
        for row in data:
            id = row['product_id']
            name = row['name']
            product_img = row['product_image']
            price = row['price']
            quantity = row['quantity']
            seller_id = 1
            # SQL query to insert data into the table
            sql = f"INSERT INTO `product_item` (`id`, `product_id`, `name`, `quantity`, `price`, `product_image`, `seller_id`) VALUES (NULL, %s, %s, %s, %s, %s, %s)"
            # Execute the query with the data
            cursor.execute(sql, (id, name, quantity, price, product_img, seller_id))
        # Commit the changes to the database
        connection.commit()
        print("Data saved successfully!")
finally:
    # Close the database connection
    connection.close()