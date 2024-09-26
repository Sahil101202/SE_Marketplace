# from app import app
from model.user_model import user_model
from flask import Blueprint, request
from model.auth import auth

user_blueprint = Blueprint('user', __name__)
user = user_model()
auth = auth()


@user_blueprint.route('/user/profile/<int:id>', methods=['GET'])
# @auth.token_auth()
def user_read_controller(id):
    return user.user_read_one(id)

@user_blueprint.route('/user/register', methods=['POST'])
# @auth.token_auth()
def user_signup_controller():
    return user.user_signup_model(request.json)

@user_blueprint.route('/seller/register', methods=['POST'])
# @auth.token_auth()
def seller_signup_controller():
    return user.seller_signup_model(request.json)

@user_blueprint.route('/seller/<id>', methods=['GET'])
# @auth.token_auth()
def seller_controller(id):
    return user.seller_model(id)

@user_blueprint.route('/user/update/<id>', methods=['PUT'])
# @auth.token_auth()
def user_update_controller(id):
    return user.user_update_model(id, request.json)

@user_blueprint.route('/user/delete/<id>', methods=['DELETE'])
# @auth.token_auth()
def user_delete_controller(id):
    return user.user_delete_model(id)

@user_blueprint.route('/user/login', methods=['POST'])
# @auth.token_auth()
def user_login_controller():
    return user.user_login(request.json)

@user_blueprint.route('/seller/login', methods=['POST'])
# @auth.token_auth()
def seller_login_controller():
    return user.seller_login(request.json)

@user_blueprint.route('/validate', methods=['POST'])
def validate_token(token):
    return user.validate_token(token)


@user_blueprint.route('/users/count', methods=['GET'])
# @auth.token_auth()
def total_user_controller():
    return user.total_user()

@user_blueprint.route('/users/count/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_total_user_controller(seller_id):
    return user.seller_total_user(seller_id)

@user_blueprint.route('/users/male_count', methods=['GET'])
# @auth.token_auth()
def male_user_controller():
    return user.male_user()

@user_blueprint.route('/users/male_count/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_male_user_controller(seller_id):
    return user.seller_male_user(seller_id)

@user_blueprint.route('/users/female_count', methods=['GET'])
# @auth.token_auth()
def female_user_controller():
    return user.female_user()

@user_blueprint.route('/users/female_count/<seller_id>', methods=['GET'])
# @auth.token_auth()
def seller_female_user_controller(seller_id):
    return user.seller_female_user(seller_id)

@user_blueprint.route('/users/active_count', methods=['GET'])
# @auth.token_auth()
def active_user_controller():
    return user.active_user()

@user_blueprint.route('/users/all_user_data', methods=['GET'])
# @auth.token_auth()
def all_user_controller():
    return user.all_users()

@user_blueprint.route('/users/conversion', methods=['GET'])
# @auth.token_auth()
def conversion_controller():
    return user.conversion()


@user_blueprint.route('/users/addresses/<int:user_id>', methods=['GET'])
# @auth.token_auth()
def get_adress_controller(user_id):
    return user.fetch_user_addresses(user_id)


@user_blueprint.route('/users/add_address/<int:user_id>', methods=['POST'])
# @auth.token_auth()
def add_adress_controller(user_id):
    return user.add_user_address(user_id, request.json)


@user_blueprint.route('/users/getMails', methods=['GET'])
# @auth.token_auth()
def get_mails_controller():
    return user.fetch_user_mails()


@user_blueprint.route('/sellers_data', methods=['GET'])
# @auth.token_auth()
def seller_data_controller():
    return user.sellers()


@user_blueprint.route('/seller/count', methods=['GET'])
# @auth.token_auth()
def seller_count_controller():
    return user.seller_count()

@user_blueprint.route('/seller/pricing/<seller_id>', methods=['POST'])
# @auth.token_auth()
def seller_pricing_controller(seller_id):
    return user.seller_pricing(seller_id, request.json)