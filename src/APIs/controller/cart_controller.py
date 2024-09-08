# from app import app
from model.cart_model import CartModel
from flask import Blueprint, request
from model.auth import auth

cart_blueprint = Blueprint('cart', __name__)
cart = CartModel()
auth = auth()

@cart_blueprint.route('/cart/<int:user_id>', methods=['GET'])
# @auth.token_auth()
def all_cart_items_controller(user_id):
    return cart.view_cart(user_id)

@cart_blueprint.route('/cart/<int:item_id>', methods=['GET'])
# @auth.token_auth()
def cart_item_detail_controller(item_id):
    return cart.cart_detail(item_id)

@cart_blueprint.route('/cart/add', methods=['POST'])
# @auth.token_auth()
def cart_add_item_controller():
    return cart.add_item_to_cart(request.json)

@cart_blueprint.route('/cart/<int:item_id>', methods=['DELETE'])
# @auth.token_auth()
def cart_delete_item_controller(item_id):
    return cart.cart_delete(item_id)

@cart_blueprint.route('/cart/remove/<int:cart_id>', methods=['DELETE'])
# @auth.token_auth()
def cart_remove_item_controller(cart_id):
    return cart.remove_item_from_cart(cart_id)

@cart_blueprint.route('/cart/update/<int:cart_id>', methods=['PUT'])
# @auth.token_auth()
def cart_update_item_controller(cart_id):
    return cart.update_cart_item(cart_id, request.json)


@cart_blueprint.route('/cart/summary/<int:user_id>', methods=['GET'])
# @auth.token_auth()
def cart_summary_controller(user_id):
    return cart.fetch_cart_summary(user_id)