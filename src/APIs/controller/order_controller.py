# from app import app
from model.order_model import order_model
from flask import Blueprint, request
from model.auth import auth

order_blueprint = Blueprint('order', __name__)
order = order_model()
auth = auth()

# Route to get all products
@order_blueprint.route('/orders/place', methods=['POST'])
# @auth.token_auth()
def place_order_controller():
    return order.place_order(request.json)

@order_blueprint.route('/orders/total_order', methods=['GET'])
# @auth.token_auth()
def total_order_controller():
    return order.total_orders()

@order_blueprint.route('/orders/total_order/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_total_order_controller(seller_id):
    return order.seller_total_orders(seller_id)


@order_blueprint.route('/orders/recent_order', methods=['GET']) 
# @auth.token_auth()
def recent_order_controller():
    return order.recent_orders()

@order_blueprint.route('/orders/recent_order/<seller_id>', methods=['GET']) 
# @auth.token_auth()
def seller_recent_order_controller(seller_id):
    return order.seller_recent_orders(seller_id)

@order_blueprint.route('/orders/recent/<int:user_id>', methods=['GET'])
# @auth.token_auth()
def user_recent_order_controller(user_id):
    return order.user_recent_orders(user_id)

@order_blueprint.route('/orders/avgOrderPrice', methods=['GET'])
# @auth.token_auth()
def avg_price_order_controller():
    return order.avg_price_orders()

@order_blueprint.route('/orders/completedOrder', methods=['GET'])
# @auth.token_auth()
def completed_order_controller():
    return order.completed_orders()

@order_blueprint.route('/orders/pendingOrder', methods=['GET'])
# @auth.token_auth()
def pending_order_controller():
    return order.pending_orders()

@order_blueprint.route('/orders/totalRevenue', methods=['GET'])
# @auth.token_auth()
def total_revenue_controller():
    return order.total_revenue()
