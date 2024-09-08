from model.stripe_model import StripeModel
from flask import Blueprint, request
from model.auth import auth

stripe_blueprint = Blueprint('stripe', __name__)
auth = auth()


# Route to get all products
@stripe_blueprint.route('/stripe/create-session', methods=['POST'])
# @auth.token_auth()
def create_checkout_session_controller():
    return StripeModel.create_checkout_session(request.json)