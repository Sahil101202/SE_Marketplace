import mysql.connector
from flask import make_response
from config.config import get_connection
from datetime import datetime

class PromotionModel:

    def __init__(self):
        try:
            self.con = get_connection()
            self.con.autocommit = True
            self.cur = self.con.cursor(dictionary=True)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.cur = None

    def add_promotion(self, promotion_data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        try:
            sql = """
            INSERT INTO promotions (name, description, discount_rate, start_date, end_date) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            self.cur.execute(sql, (
                promotion_data['name'],
                promotion_data['description'],
                promotion_data['discount_percentage'],
                promotion_data['start_date'],
                promotion_data['end_date']
            ))

            if self.cur.rowcount > 0:
                return make_response({'response': True, 'message': 'Promotion added successfully'}, 201)
            else:
                return make_response({'response': False, 'message': 'Failed to add promotion'}, 500)

        except mysql.connector.Error as err:
            return make_response({'response': False, 'message': f"Failed to add promotion: {err}"}, 500)

    def get_all_promotions(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = "SELECT * FROM promotions"
        self.cur.execute(sql)
        promotions = self.cur.fetchall()

        if promotions:
            return make_response({'response': True, 'message': 'Promotions retrieved successfully', 'payload': promotions}, 200)
        else:
            return make_response({'response': False, 'message': 'No promotions found'}, 404)

    def get_promotion(self, promotion_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = "SELECT * FROM promotions WHERE id=%s"
        self.cur.execute(sql, (promotion_id,))
        promotion = self.cur.fetchone()

        if promotion:
            return make_response({'response': True, 'message': 'Promotion retrieved successfully', 'payload': promotion}, 200)
        else:
            return make_response({'response': False, 'message': 'Promotion not found'}, 404)

    def update_promotion(self, promotion_id, promotion_data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = "UPDATE promotions SET "
        sql += ', '.join([f"{key}=%s" for key in promotion_data.keys()])
        sql += " WHERE id=%s"
        values = list(promotion_data.values()) + [promotion_id]

        self.cur.execute(sql, values)
        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Promotion updated successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Promotion not found or data not changed'}, 404)

    def delete_promotion(self, promotion_data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = "DELETE FROM promotions WHERE name=%s"
        self.cur.execute(sql, (promotion_data['name'],))

        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Promotion deleted successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Promotion not found'}, 404)
        

    def count_promotions(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM promotions"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        
    def seller_count_promotions(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(p.id) as num FROM promotions p JOIN promotion_category pc ON pc.promotion_id=p.id JOIN product c ON c.id=pc.category_id JOIN product_item pi ON pi.product_id=c.id WHERE pi.seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)

    def active_promotions(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM promotions WHERE end_date >= NOW()"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        
    def seller_active_promotions(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(p.id) as num FROM promotions p JOIN promotion_category pc ON pc.promotion_id=p.id JOIN product c ON c.id=pc.category_id JOIN product_item pi ON pi.product_id=c.id WHERE pi.seller_id={seller_id} AND end_date >= NOW()"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        

    def expired_promotions(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM promotions WHERE end_date < NOW()"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        
    def seller_expired_promotions(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(p.id) as num FROM promotions p JOIN promotion_category pc ON pc.promotion_id=p.id JOIN product c ON c.id=pc.category_id JOIN product_item pi ON pi.product_id=c.id WHERE pi.seller_id={seller_id} AND end_date < NOW()"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        

    def avgdollar_promotions(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT AVG(discount_rate) as num FROM promotions"
        self.cur.execute(sql)
        result1 = self.cur.fetchall()
        rate = result1[0]['num']

        sql1 = "SELECT SUM(pro.price) as num FROM promotions p JOIN promotion_category pc ON pc.promotion_id=p.id JOIN product c ON c.id=pc.category_id JOIN product_item pro ON pro.product_id=c.id"
        self.cur.execute(sql1)
        result2 = self.cur.fetchall()
        price = result2[0]['num']

        result = [{"rate" : rate, "price" : price}]

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        

    def avgpercent_promotions(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT AVG(discount_rate) as num FROM promotions"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No Data found'}, 404)
        
        
