import mysql.connector
from flask import make_response
from config.config import get_connection
from datetime import datetime
from datetime import date

class order_model:

    def __init__(self):
        try:
            self.con = get_connection()
            self.con.autocommit = True
            self.cur = self.con.cursor(dictionary=True)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.cur = None

    def place_order(self, data):
        try:
            if not self.cur:
                return make_response({'response': False, 'message': 'Database connection not established'}, 500)
            
            # Start a transaction
            # self.cur.execute("START TRANSACTION;")
            
            # Use parameterized queries to prevent SQL injection
            payment_query = "SELECT id FROM `payment_type` WHERE name=%s"
            self.cur.execute(payment_query, (data['payment'],))
            payment_result = self.cur.fetchone()
            
            if not payment_result:
                return make_response({'response': False, 'message': 'Invalid payment method'}, 400)
            
            payment_id = payment_result['id']
            today = datetime.today().strftime('%Y-%m-%d')
            
            # Insert order into `shop_order`
            order_query = """
                INSERT INTO `shop_order` (`user_id`, `order_date`, `payment_method_id`, `shipping_address_id`, `order_total`, `order_status`)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            self.cur.execute(order_query, (data['user_id'], today, payment_id, data['address_id'], data['order_total'], 'confirmed'))
            
            if self.cur.rowcount == 0:
                # self.cur.execute("ROLLBACK;")
                return make_response({'response': False, 'message': 'Failed to place order'}, 500)
            
            # Get the last inserted order id
            order_id = self.cur.lastrowid
            
            # Insert order lines
            for product in data['products']:
                order_line_query = """
                    INSERT INTO `order_line` (`product_item_id`, `order_id`, `qty`, `price`, `user_id`)
                    VALUES (%s, %s, %s, %s, %s)
                """
                self.cur.execute(order_line_query, (product['id'], order_id, product['qty'], product['price'], data['user_id']))
                
                if self.cur.rowcount == 0:
                    # self.cur.execute("ROLLBACK;")
                    return make_response({'response': False, 'message': 'Failed to place order'}, 500)
                
                # Remove items from shop_cart_item table
                remove_cart_item_query = """
                    DELETE sci
                    FROM `shopping_cart_item` sci
                    JOIN `shopping_cart` sc ON sci.cart_id = sc.id
                    WHERE sc.user_id = %s AND sci.product_item_id = %s
                """
                self.cur.execute(remove_cart_item_query, (data['user_id'], product['id']))

                if self.cur.rowcount == 0:
                    # self.cur.execute("ROLLBACK;")
                    return make_response({'response': False, 'message': 'Failed to remove cart'}, 500)
                
            
            # Commit the transaction
            # self.cur.execute("COMMIT;")
            return make_response({'response': True, 'message': 'Order placed successfully'}, 201)
        
        except Exception as e:
            # self.cur.execute("ROLLBACK;")
            return make_response({'response': False, 'message': f'Unexpected error: {str(e)}'}, 500)

    def get_order(self, order_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        order_sql = "SELECT * FROM orders WHERE order_id=%s"
        self.cur.execute(order_sql, (order_id,))
        order = self.cur.fetchone()

        if not order:
            return make_response({'response': False, 'message': 'Order not found'}, 404)

        order_items_sql = "SELECT * FROM order_items WHERE order_id=%s"
        self.cur.execute(order_items_sql, (order_id,))
        order_items = self.cur.fetchall()

        order['items'] = order_items
        return make_response({'response': True, 'message': 'Order retrieved successfully', 'payload': order}, 200)

    def get_all_orders_for_user(self, user_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = "SELECT * FROM orders WHERE user_id=%s"
        self.cur.execute(sql, (user_id,))
        orders = self.cur.fetchall()

        if orders:
            for order in orders:
                order_items_sql = "SELECT * FROM order_items WHERE order_id=%s"
                self.cur.execute(order_items_sql, (order['order_id'],))
                order_items = self.cur.fetchall()
                order['items'] = order_items

            return make_response({'response': True, 'message': 'Orders retrieved successfully', 'payload': orders}, 200)
        else:
            return make_response({'response': False, 'message': 'No orders found for user'}, 404)

    def update_order_status(self, order_id, status):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = "UPDATE orders SET status=%s WHERE order_id=%s"
        self.cur.execute(sql, (status, order_id))

        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Order status updated successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Order not found or status not updated'}, 404)

    def cancel_order(self, order_id):
        return self.update_order_status(order_id, 'cancelled')



    def total_orders(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT COUNT(id) as num FROM `shop_order`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def seller_total_orders(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT COUNT(pi.id) as num FROM `product_item` pi JOIN  `order_line` ol ON ol.product_item_id=pi.id WHERE pi.seller_id={seller_id}"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        
        

    def recent_orders(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT id, order_date, order_total, user_id FROM `shop_order` ORDER BY `order_date` DESC "
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        
    def seller_recent_orders(self, seller_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT so.id, so.order_date, so.order_total, so.user_id FROM `shop_order` so JOIN order_line ol ON ol.order_id=so.id JOIN product_item pi ON pi.id=ol.product_item_id WHERE pi.seller_id={seller_id} ORDER BY `order_date` DESC "
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No orders found'}, 404)
        

    def avg_price_orders(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT AVG(order_total) as num FROM `shop_order`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def total_revenue(self):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = "SELECT SUM(order_total) as num FROM `shop_order`"
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)
        

    def user_recent_orders(self, user_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT id, order_date, order_total, order_status FROM `shop_order` WHERE user_id={user_id} ORDER BY `order_date` DESC "
        self.cur.execute(sql)
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Number fetched successfully', 'data': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No categories found'}, 404)