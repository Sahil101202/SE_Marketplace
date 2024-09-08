import mysql.connector
import os

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

# Directory containing the images
image_directory = "/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/Kids"

# Get a list of all image files in the directory
image_files = os.listdir(image_directory)

# Iterate over the image files and update the corresponding records in the database
for image_file in image_files:
    # Extract the product name from the image filename (assuming the filename is the same as the product name)
    product_name = os.path.splitext(image_file)[0]
    # Construct the image file path
    image_path = os.path.join(image_directory, image_file)
    # Open the image file in binary mode
    with open(image_path, "rb") as file:
        # Read the binary data from the image file
        image_data = file.read()
    # SQL statement to update product_img column based on product name
    sql = "UPDATE product_item SET product_image = %s WHERE name = %s"
    # Execute the SQL statement with the image data and product name
    cursor.execute(sql, (image_data, product_name))
    # Commit the transaction
    connection.commit()


# Close the cursor and connection
cursor.close()
connection.close()