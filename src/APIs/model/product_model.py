import mysql.connector
from mysql.connector import Error
import json
from flask import make_response, send_file, abort
from config.config import db_config  # Ensure this file and variable are correctly set up
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import base64


class product_model:

    def __init__(self):
        try:
            self.con = mysql.connector.connect(
                host=db_config['host'],
                user=db_config['user'],
                password=db_config['password'],
                database=db_config['database']
            )
            print("Connection to Database successful!")
            self.con.autocommit = True
            self.cur = self.con.cursor(dictionary=True)
            self.cur = self.con.cursor(buffered=True)
            
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.cur = None

    def add_product(self, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        try:
            # Decode the base64 image
            image_data = base64.b64decode(data['product_image'])
            # Prepare the SQL statement
            sql = """
            INSERT INTO product_item (name, product_image, product_id, quantity, price) 
            VALUES (%s, %s, %s, %s, %s)
            """
            # Execute the SQL statement with parameters
            self.cur.execute(sql, (data['name'], image_data, data['category_id'], data['quantity'], data['price']))
            # self.conn.commit()

            if self.cur.rowcount > 0:
                product_id = self.cur.lastrowid
                return make_response({'response': True, 'message': 'Product added successfully', 'product_id': product_id}, 201)
            else:
                return make_response({'response': False, 'message': 'Failed to add product'}, 500)
        except Exception as e:
            # self.conn.rollback()
            return make_response({'response': False, 'message': str(e)}, 500)


    def read_all_products(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        try:
            sql = '''SELECT 
                    pi.id AS item_id, 
                    pi.name AS item_name, 
                    pi.price, 
                    p.name AS subcategory, 
                    c.category_name AS category,
                    p.id as category_id
                FROM 
                    `product_item` pi 
                JOIN 
                    `product` p ON p.id = pi.product_id 
                JOIN 
                    `product_category` c ON c.id = p.category_id;
                '''
            self.cur.execute(sql)
            result = self.cur.fetchall()

            if result:
                return make_response({'response': True, 'message': 'Products fetched successfully', 'data': result}, 200)
            else:
                return make_response({'response': False, 'message': 'No products found'}, 404)
        except Error as e:
            print(f"Error reading products: {e}")
            return make_response({'response': False, 'message': 'Error reading products'}, 500)

    def get_product_image(self, product_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        if not isinstance(product_id, int):
            return make_response({'response': False, 'message': 'Invalid product ID'}, 400)

        try:
            sql = "SELECT product_image FROM product_item WHERE id = %s"
            self.cur.execute(sql, (product_id,))
            result = self.cur.fetchone()

            if result and result[0]:
                # Convert the BLOB data to a base64-encoded string
                image_data = base64.b64encode(result[0]).decode('utf-8')
                return make_response({'response': True, 'message': 'Image fetched successfully', 'data': image_data}, 200)
            else:
                return make_response({'response': False, 'message': 'No Image'}, 404)
        except mysql.connector.Error as e:
            print(f"Database error: {e}")
            return make_response({'response': False, 'message': 'Error fetching product image'}, 500)
        except Exception as e:
            print(f"General error: {e}")
            return make_response({'response': False, 'message': 'An unexpected error occurred'}, 500)

        

    def read_one_product(self, id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT pi.id as item_id, pi.product_id, pi.name, pi.quantity, pi.price, s.name, pi.description FROM product_item pi JOIN sellers s ON s.id=pi.seller_id WHERE pi.id={id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Products fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No products found'}, 404)

    def update_product(self, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"UPDATE product_item SET "
        sql += ', '.join([f"{key}={data[key]}" for key in data.keys()])
        sql += f" WHERE id={data['id']}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Products Updated successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Product update failed or no change in data'}, 500)
        
    def delete_product(self, id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"DELETE FROM product_item WHERE id={id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Products deleted successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Product deletion failed or no product not found'}, 500)
        
    def get_all_categories(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT DISTINCT id, name FROM `product`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Categories fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        
    def get_categories(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT DISTINCT p.id, p.name FROM `product` p JOIN product_item pi ON pi.product_id=p.id WHERE pi.seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Categories fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)

    def get_products_by_category(self, category_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = """
        SELECT product.id as product_id, product.name as product_name, product_item.id as item_id, 
               product_item.name as name, product_item.price, product_item.quantity 
        FROM product 
        JOIN product_item ON product.id = product_item.product_id 
        WHERE product.category_id = %s
        """
        self.cur.execute(sql, (category_id,))
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Products fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No products found for this category'}, 404)

    def get_products_by_subcategory(self, category_id, subcategory_name):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = """
        SELECT product.id as product_id, product.name as product_name, product_item.id as item_id, 
               product_item.name as name, product_item.price, product_item.quantity 
        FROM product 
        JOIN product_item ON product.id = product_item.product_id 
        WHERE product.category_id = %s AND product.name = %s
        """
        self.cur.execute(sql, (category_id, subcategory_name))
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Products fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No products found for this subcategory'}, 404)    
        

    def count_products(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM product_item"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def seller_count_products(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(id) as num FROM product_item WHERE seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)

    def count_category(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM product"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def seller_count_category(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(pi.id) as num FROM product p JOIN product_item pi ON pi.product_id=p.id WHERE pi.seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def max_price(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT MAX(price) as num FROM `product_item`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def seller_max_price(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT MAX(price) as num FROM `product_item` WHERE seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def min_price(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT MIN(price) as num FROM `product_item`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def seller_min_price(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT MIN(price) as num FROM `product_item` WHERE seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        
    
    def avg_price(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT AVG(price) as num FROM `product_item`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def seller_avg_price(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT AVG(price) as num FROM `product_item` WHERE seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        
    
    def fetch_all_products(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT pi.id, pi.name as item, pi.price, c.name as category, pi.quantity FROM product_item pi JOIN product c ON pi.product_id=c.id"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Products fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No products found'}, 404)
        

    def sizes_model(self, category_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = """
            SELECT DISTINCT s.value AS size_name
            FROM variation_option s
            JOIN variation v ON s.variation_id = v.id
            WHERE v.category_id = %s
        """
        self.cur.execute(sql, (category_id,))
        result = self.cur.fetchall()

        if result:
            sizes = [row[0] for row in result]
            return make_response({'response': True, 'message': 'Sizes fetched successfully', 'sizes': sizes}, 200)
        else:
            return make_response({'response': False, 'message': 'No sizes found for this category'}, 404)
