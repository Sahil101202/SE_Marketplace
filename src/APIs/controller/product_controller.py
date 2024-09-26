# from app import app
from model.product_model import product_model
from flask import Blueprint, request
from model.auth import auth

product_blueprint = Blueprint('product', __name__)
product = product_model()
auth = auth()

# Route to get all products
@product_blueprint.route('/products', methods=['GET'])
def read_all_products_controller():
    return product.read_all_products()


@product_blueprint.route('/products/seller/<seller_id>', methods=['GET'])
def read_all_products_seller_controller(seller_id):
    return product.read_all_products_seller(seller_id)

# Route to get details of a specific product by its ID
@product_blueprint.route('/products/<int:product_id>', methods=['GET'])
def product_detail_controller(product_id):
    return product.read_one_product(product_id)

# Route to add a new product
@product_blueprint.route('/products/add', methods=['POST'])
# @auth.token_auth()
def add_prodduct_controller():
    return product.add_product(request.json)

# Route to delete a product by its ID
@product_blueprint.route('/products/<int:product_id>', methods=['DELETE'])
# @auth.token_auth()
def delete_product_controller(product_id):
    return product.delete_product(product_id)

# Route to update a product by its ID
@product_blueprint.route('/products/update', methods=['PUT'])
# @auth.token_auth()
def update_product_controller():
    return product.update_product(request.json)



# Route to get all categories
@product_blueprint.route('/categories', methods=['GET'])
# @auth.token_auth()
def get_all_categories_controller():
    return product.get_all_categories()

@product_blueprint.route('/categories/<seller_id>', methods=['GET'])
# @auth.token_auth()
def get_categories_controller(seller_id):
    return product.get_categories(seller_id)

# Route to get products by category
@product_blueprint.route('/products/category/<int:category_id>', methods=['GET'])
# @auth.token_auth()
def get_products_by_category_controller(category_id):
    return product.get_products_by_category(category_id)

# Route to get products by subcategory
@product_blueprint.route('/products/category/<int:category_id>/<string:subcategory_name>', methods=['GET'])
# @auth.token_auth()
def get_products_by_subcategory_controller(category_id, subcategory_name):
    return product.get_products_by_subcategory(category_id, subcategory_name)

# Route to get images by id
@product_blueprint.route('/products/image/<int:product_id>', methods=['GET'])
# @auth.token_auth()
def image_product_controller(product_id):
    return product.get_product_image(product_id)


@product_blueprint.route('/products/counts', methods=['GET'])
# @auth.token_auth()
def count_item_controller():
    return product.count_products()

@product_blueprint.route('/products/counts/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_count_item_controller(seller_id):
    return product.seller_count_products(seller_id)

@product_blueprint.route('/products/category_counts', methods=['GET'])
# @auth.token_auth()
def count_category_controller():
    return product.count_category()

@product_blueprint.route('/products/category_counts/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_count_category_controller(seller_id):
    return product.seller_count_category(seller_id)


@product_blueprint.route('/products/max_price', methods=['GET'])
# @auth.token_auth()
def max_price_controller():
    return product.max_price()

@product_blueprint.route('/products/max_price/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_max_price_controller(seller_id):
    return product.seller_max_price(seller_id)

@product_blueprint.route('/products/min_price', methods=['GET'])
# @auth.token_auth()
def min_price_controller():
    return product.min_price()

@product_blueprint.route('/products/min_price/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_min_price_controller(seller_id):
    return product.seller_min_price(seller_id)

@product_blueprint.route('/products/avg_price', methods=['GET'])
# @auth.token_auth()
def avg_price_controller():
    return product.avg_price()


@product_blueprint.route('/products/avg_price/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_avg_price_controller(seller_id):
    return product.seller_avg_price(seller_id)

@product_blueprint.route('/products/fetchAll', methods=['GET'])
# @auth.token_auth()
def fetchAll_controller():
    return product.fetch_all_products()

@product_blueprint.route('/products/sizes/<category_id>', methods=['GET'])
# @auth.token_auth()
def sizes_controller(category_id):
    return product.sizes_model(category_id)