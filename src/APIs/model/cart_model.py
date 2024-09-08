import mysql.connector
from flask import make_response
from config.config import get_connection

class CartModel:

    def __init__(self):
        try:
            self.con = get_connection()
            self.con.autocommit = True
            self.cur = self.con.cursor(dictionary=True)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.cur = None

    def add_item_to_cart(self, data):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        if not data or 'user_id' not in data or 'product_item_id' not in data or 'qty' not in data:
            return make_response({'response': False, 'message': 'Invalid data received'}, 400)
        
        user_id = data['user_id']
        product_item_id = data['product_item_id']
        qty = data['qty']

        try:
            # Check if the product item is available
            product_check_sql = "SELECT quantity as qty FROM product_item WHERE id = %s"
            self.cur.execute(product_check_sql, (product_item_id,))
            product = self.cur.fetchone()
            
            if not product or not product['qty']:
                return make_response({'response': False, 'message': 'Product item not available'}, 404)
            
            # Check if the cart exists for the user
            cart_sql = "SELECT id FROM shopping_cart WHERE user_id = %s"
            self.cur.execute(cart_sql, (user_id,))
            cart = self.cur.fetchone()

            if not cart:
                # Create a new cart if it does not exist
                add_user_cart_sql = "INSERT INTO shopping_cart (user_id) VALUES (%s)"
                self.cur.execute(add_user_cart_sql, (user_id,))
                self.cur.execute(cart_sql, (user_id,))
                cart = self.cur.fetchone()

            cart_id = cart['id']

            # Check if the item already exists in the cart
            check_sql = """
                SELECT sci.qty
                FROM shopping_cart_item sci
                JOIN shopping_cart sc ON sci.cart_id = sc.id
                WHERE sc.user_id = %s AND sci.product_item_id = %s
            """
            self.cur.execute(check_sql, (user_id, product_item_id))
            result = self.cur.fetchone()

            if result:
                # Update the quantity if the item exists
                new_qty = result['qty'] + qty
                print(
                    new_qty, product_item_id, user_id
                )
                if new_qty > product['qty']:
                    return make_response({'response': False, 'message': 'Not enoght product!!'}, 500)
                
                update_sql = """
                    UPDATE shopping_cart_item sci
                    JOIN shopping_cart sc ON sci.cart_id = sc.id
                    SET sci.qty = %s
                    WHERE sc.user_id = %s AND sci.product_item_id = %s
                """
                self.cur.execute(update_sql, (new_qty, user_id, product_item_id))
            else:
                # Insert a new item if it does not exist
                insert_sql = """
                    INSERT INTO shopping_cart_item (cart_id, product_item_id, qty)
                    VALUES (%s, %s, %s)
                """
                self.cur.execute(insert_sql, (cart_id, product_item_id, qty))

            if self.cur.rowcount > 0:
                return make_response({'response': True, 'message': 'Item added to cart successfully'}, 200)
            else:
                return make_response({'response': False, 'message': f'Failed to add item to cart cart_id = {cart_id}, product id = {product_item_id}, user id = {user_id}'}, 500)

        except Exception as e:
            print(f"Error: {e}")
            return make_response({'response': False, 'message': 'An error occurred'}, 500)



    def view_cart(self, user_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = f"""
        SELECT 
            sci.product_item_id, 
            pi.name AS product_name, 
            sci.qty, 
            pi.price,
            sci.id as id
        FROM 
            shopping_cart_item sci
        JOIN 
            shopping_cart sc ON sci.cart_id = sc.id
        JOIN 
            product_item pi ON sci.product_item_id = pi.id
        WHERE 
            sc.user_id = %s
        """
        self.cur.execute(sql, (user_id,))
        result = self.cur.fetchall()

        if result:
            return make_response({'response': True, 'message': 'Cart retrieved successfully', 'payload': result}, 200)
        else:
            return make_response({'response': False, 'message': 'No items in cart'}, 404)

    def update_cart_item(self, cart_id, data):
        product_item_id = data['product_item_id']
        qty = data['qty']
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = f"""
        UPDATE 
            `shopping_cart_item` sci
        JOIN 
            `shopping_cart` sc ON sci.cart_id = sc.id
        SET 
            sci.qty = {qty}
        WHERE 
            sci.id = {cart_id}
            AND sci.product_item_id = {product_item_id}
        """
        self.cur.execute(sql)

        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Cart item updated successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Failed to update cart item or no change in quantity'}, 500)

    def remove_item_from_cart(self, cart_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)

        sql = f"""
        DELETE
        FROM `shopping_cart_item`
        WHERE id = {cart_id}
        """
        self.cur.execute(sql)

        if self.cur.rowcount > 0:
            return make_response({'response': True, 'message': 'Item removed from cart successfully'}, 200)
        else:
            return make_response({'response': False, 'message': 'Failed to remove item from cart'}, 500)
        

    def fetch_cart_summary(self, user_id):
        if not self.cur:
            return make_response({'response': False, 'message': 'Database connection not established'}, 500)
        
        sql = f"SELECT pi.id, pi.name, pi.price, sci.qty FROM shopping_cart_item sci JOIN shopping_cart sc ON sc.id=sci.cart_id JOIN product_item pi ON pi.id=sci.product_item_id WHERE sc.user_id={user_id}"
        self.cur.execute(sql)
        cart_items = self.cur.fetchall()
        
        return make_response({'response': True, 'message': 'Cart retrieved successfully', 'payload': cart_items}, 200)
    


    