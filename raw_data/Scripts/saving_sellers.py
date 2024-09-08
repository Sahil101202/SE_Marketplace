import hashlib
import mysql.connector
import json

# Function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Load vendors data from JSON file
with open('/Users/sahilnakrani/Documents/E-commerce/Software-Engineering/raw_data/sellers.json', 'r') as file:
    vendors = json.load(file)

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="sahil",
    password="101202",
    database="software_engineering"
)
cursor = conn.cursor()

# Insert vendors into the database
for vendor in vendors:
    hashed_password = hash_password(vendor['password'])
    insert_query = '''
    INSERT INTO sellers (name, email, password, description, photo, registered_date)
    VALUES (%s, %s, %s, %s, %s, %s)
    '''
    cursor.execute(insert_query, (vendor['name'], vendor['email'], hashed_password, vendor['description'], vendor['photo'], vendor['registered_date']))

# Commit and close
conn.commit()
cursor.close()
conn.close()
