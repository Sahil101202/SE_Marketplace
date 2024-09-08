import mysql.connector
import json
from flask import make_response
from config.config import get_connection  # Ensure this file and variable are correctly set up
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from app import app

class user_model:

    def __init__(self):
        try:
            self.con = get_connection()
            self.con.autocommit = True
            self.cur = self.con.cursor(dictionary=True)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.cur = None

    def user_read_one(self, id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT id, email, phone, name, gender, role_id FROM customer WHERE id={id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()
        
        if result:
            return make_response({'response': True, 'message': 'User retrieved successfully', 'payload': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No data found'}, 404)


    def user_get_all_model(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        sql = 'SELECT customer_id, email, phone, name, gender, role_id FROM customer'
        self.cur.execute(sql)
        result = self.cur.fetchall()
        if result:
            return make_response({'response': True, 'message': 'Users retrieved successfully', 'payload': result})
        else:
            return make_response({'response': False, 'message': 'No data found'}, 204)
        

    def sellers(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        sql = 'SELECT s.id, s.name, COUNT(p.id) AS num FROM sellers s JOIN product_item p ON p.seller_id=s.id GROUP BY s.id, s.name ORDER BY s.id'
        self.cur.execute(sql)
        result = self.cur.fetchall()
        if result:
            return make_response({'response': True, 'message': 'Users retrieved successfully', 'payload': result})
        else:
            return make_response({'response': False, 'message': 'No data found'}, 204)

    def user_signup_model(self, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        check_sql = f"SELECT email FROM customer WHERE email='{data['email']}'"
        self.cur.execute(check_sql)
        result = self.cur.fetchall()
        if result:
            return make_response({'response': False, 'message': 'Email already exists'}, 200)

        hashed_password = generate_password_hash(data['password'])
        sql = (
            f"INSERT INTO `customer` (`id`, `email`, `phone`, `password`, `name`, `gender`, `role_id`) "
            f"VALUES (NULL, '{data['email']}', '{data['phone']}', '{hashed_password}', '{data['name']}', '{data['gender']}', 1)"
        )
        self.cur.execute(sql)
        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'User registered successfully'})
        else:
            return make_response({'response': False, 'message': 'User registration failed'}, 500)
        

    def seller_signup_model(self, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        check_sql = f"SELECT email FROM sellers WHERE email='{data['email']}'"
        self.cur.execute(check_sql)
        result = self.cur.fetchall()
        if result:
            return make_response({'response': False, 'message': 'Email already exists'}, 200)

        hashed_password = generate_password_hash(data['password'])
        date = datetime.now()
        sql = (
            f"INSERT INTO `sellers` (`id`, `name`, `email`, `password`, `description`, `photo`, `registered_date`) "
            f"VALUES (NULL, '{data['name']}', '{data['email']}', '{hashed_password}', '{data['description']}', Null, '{date}')"
        )
        self.cur.execute(sql)
        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Seller registered successfully'})
        else:
            return make_response({'response': False, 'message': 'Seller registration failed'}, 500)
        
    def seller_model(self, id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        if not id:
            return make_response({'response': False, 'message': 'Seller id is required'}, 400)
        
        try:
            sql = "SELECT id, name, registered_date, subscription_plan, subscription_expiry_date FROM sellers WHERE id = %s"
            self.cur.execute(sql, (id,))
            result = self.cur.fetchone()
            
            if result:
                return make_response({'response': True, 'message': 'Seller detail got successfully', 'data': result})
            else:
                return make_response({'response': False, 'message': 'Seller not found'}, 404)
        
        except Exception as e:
            return make_response({'response': False, 'message': str(e)}, 500)
                                 
                                

    def user_update_model(self, id, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        sql = 'UPDATE customer SET '
        sql += ', '.join([f"{key}='{value}'" for key, value in data.items()])
        sql += f' WHERE id={id}'

        self.cur.execute(sql)
        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'User updated successfully'})
        else:
            return make_response({'response': False, 'message': 'No data to update'}, 204)

    def user_delete_model(self, id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        sql = f'DELETE FROM customer WHERE customer_id={id}'
        self.cur.execute(sql)
        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'User deleted successfully'})
        else:
            return make_response({'response': False, 'message': 'No data to delete'}, 204)

    def user_login(self, data):
        # return data
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        # Sanitize input to prevent SQL injection
        email = data['email']
        sql = "SELECT id, password, role_id, email, name FROM customer WHERE email=%s"
        self.cur.execute(sql, (email,))
        result = self.cur.fetchone()

        if result:
            hashed_password_from_db = result['password']
            raw_password = data['password']
            role = result['role_id']
            # hashed_pass = generate_password_hash(raw_password)

            # return {'raw' : raw_password, 'hashed_db' : hashed_password_from_db, 'pass' : hashed_pass}

            if hashed_password_from_db and isinstance(hashed_password_from_db, str):
                if check_password_hash(hashed_password_from_db, raw_password):
                    if role !=  2:
                        exptime = datetime.now() + timedelta(hours=24)
                        exp_epoc_time = exptime.timestamp()
                        payload = {
                            "id": result['id'],
                            "role_id": result['role_id'],
                            "name": result['name'],
                            "email": result['email'],
                            "exp": int(exp_epoc_time)
                        }
                        jwt_token = jwt.encode(payload, "sahil101202", algorithm="HS256")
                        jwt_token_str = jwt_token.decode('utf-8')
                        return make_response({'response': True, 'key': 'user', 'message': 'User login successful', 'token': jwt_token_str}, 200)
                    else:
                        exptime = datetime.now() + timedelta(hours=24)
                        exp_epoc_time = exptime.timestamp()
                        payload = {
                            "id": result['id'],
                            "role_id": result['role_id'],
                            "name": result['name'],
                            "email": result['email'],
                            "exp": int(exp_epoc_time)
                        }
                        jwt_token = jwt.encode(payload, "sahil101202", algorithm="HS256")
                        jwt_token_str = jwt_token.decode('utf-8')
                        return make_response({'response': True, 'key': 'admin', 'message': 'Admin login successful', 'token': jwt_token_str}, 200)
                else:
                    return make_response({'response': False, 'message': 'Invalid email or password'}, 401)
            else:
                return make_response({'response': False, 'message': 'Invalid stored password format'}, 500)
        else:
            return make_response({'response': False, 'message': 'User not found'}, 404)
        

    def seller_login(self, data):
        # return data
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        # Sanitize input to prevent SQL injection
        email = data['email']
        sql = "SELECT id, password, email, name FROM sellers WHERE email=%s"
        self.cur.execute(sql, (email,))
        result = self.cur.fetchone()

        if result:
            hashed_password_from_db = result['password']
            raw_password = data['password']
            role = 4
            # hashed_pass = generate_password_hash(raw_password)

            # return {'raw' : raw_password, 'hashed_db' : hashed_password_from_db, 'pass' : hashed_pass}

            if hashed_password_from_db and isinstance(hashed_password_from_db, str):
                if check_password_hash(hashed_password_from_db, raw_password):
                    if role == 4:
                        exptime = datetime.now() + timedelta(hours=24)
                        exp_epoc_time = exptime.timestamp()
                        payload = {
                            "id": result['id'],
                            "name": result['name'],
                            "email": result['email'],
                            "exp": int(exp_epoc_time)
                        }
                        jwt_token = jwt.encode(payload, "sahil101202", algorithm="HS256")
                        jwt_token_str = jwt_token.decode('utf-8')
                        return make_response({'response': True, 'key': 'seller', 'message': 'Seller login successful', 'token': jwt_token_str}, 200)
                    else:
                        return make_response({'response': True, 'key': None, 'message': "Error while login into seller's account"}, 404)
                else:
                    return make_response({'response': False, 'message': 'Invalid email or password'}, 401)
            else:
                return make_response({'response': False, 'message': 'Invalid stored password format'}, 500)
        else:
            return make_response({'response': False, 'message': 'Seller not found'}, 404)
        

    def validate_token(self, token):
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=["HS256"])
            return {'response': True, 'message': 'Token is valid', 'payload': payload}
        except jwt.ExpiredSignatureError:
            return {'response': False, 'message': 'Token has expired'}
        except jwt.InvalidTokenError:
            return {'response': False, 'message': 'Invalid token'}



    def total_user(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM `customer`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)
        

    def seller_count(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM `sellers`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)


    def seller_total_user(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(c.id) as num FROM `customer` c JOIN shop_order so ON so.user_id=c.id JOIN order_line ol ON ol.order_id=so.id JOIN product_item pi ON pi.id=ol.product_item_id WHERE pi.seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)


    def male_user(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(id) as num FROM `customer` WHERE gender='male'"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)
        

    def seller_male_user(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(id) as num FROM `customer` c JOIN shop_order so ON so.user_id=c.id JOIN order_line ol ON ol.order_id=so.id JOIN product_item pi ON pi.id=ol.product_item_id WHERE pi.seller_id={seller_id} AND gender='male'"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)



    def female_user(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM `customer` WHERE gender='female'"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)
        

    def seller_female_user(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM `customer` c JOIN shop_order so ON so.user_id=c.id JOIN order_line ol ON ol.order_id=so.id JOIN product_item pi ON pi.id=ol.product_item_id WHERE pi.seller_id={seller_id} AND gender='female'"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)


    def active_user(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(c.id) as num FROM `customer` c JOIN `shop_order` so ON so.user_id=c.id"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)
        


    def all_users(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT id, name, email, gender, phone FROM `customer`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)

    def conversion(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sqlUser = "SELECT COUNT(id) as num FROM `customer`"
        self.cur.execute(sqlUser)
        totalUsers = self.cur.fetchall()

        sql = "SELECT COUNT(c.id) as num FROM `customer` c JOIN `shop_order` so ON so.user_id=c.id"
        self.cur.execute(sql)
        orderUser = self.cur.fetchall()

        result = [{'totalUser': totalUsers[0]['num'], 'orderUser': orderUser[0]['num']}]

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No User found'}, 404)
        

    def fetch_user_addresses(self, user_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT * FROM `address` WHERE user_id = {user_id}"
        self.cur.execute(sql)
        addresses = self.cur.fetchall()

        return make_response({'response': True, 'message': 'Adresses retrieved successfully', 'data': addresses}, 200)
    

    def add_user_address(self, user_id, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        check = f"SELECT `user_id`, `street_number`, `address_line`, `city`, `region`, `postal_code`, `country` FROM `address` WHERE user_id='{user_id}' AND street_number='{data['street_number']}' AND address_line='{data['address_line']}' AND city='{data['city']}' AND region='{data['region']}' AND postal_code='{data['postal_code']}' AND country='{data['country']}'"
        self.cur.execute(check)
        
        if self.cur.fetchone():
            return make_response({'response': False, 'message': 'Address already exists'}, 400)
        else:
            sql = f"INSERT INTO `address` (`id`, `user_id`, `street_number`, `address_line`, `city`, `region`, `postal_code`, `country`, `is_default`) VALUES (NULL, '{user_id}','{data['street_number']}', '{data['address_line']}', '{data['city']}', '{data['region']}', '{data['postal_code']}', '{data['country']}', 1)"
            self.cur.execute(sql)
            
            if self.cur.rowcount > 0:
                return make_response({'response': True, 'message': 'Adresses added successfully'}, 200)
            else:
                return make_response({'response': False, 'message': 'Failed to add address'}, 500)
        


    def fetch_user_mails(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT email FROM `customer`"
        self.cur.execute(sql)
        addresses = self.cur.fetchall()

        return make_response({'response': True, 'message': 'Emails retrieved successfully', 'data': addresses}, 200)
