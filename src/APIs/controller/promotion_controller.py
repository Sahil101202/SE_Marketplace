from flask import Flask, Blueprint, request
from model.promotion_model import PromotionModel
# from app import app
from model.auth import auth

promotion_blueprint = Blueprint('promotion', __name__)
promotion_model = PromotionModel()

@promotion_blueprint.route('/promotions', methods=['POST'])
def add_promotion():
    return promotion_model.add_promotion(request.json)

@promotion_blueprint.route('/allPromotions', methods=['GET'])
def get_all_promotions():
    return promotion_model.get_all_promotions()

@promotion_blueprint.route('/promotions/<int:id>', methods=['GET'])
def get_promotion(id):
    return promotion_model.get_promotion(id)

@promotion_blueprint.route('/promotions', methods=['PUT'])
def update_promotion():
    data = request.get_json()
    return promotion_model.update_promotion(data)

@promotion_blueprint.route('/promotions', methods=['DELETE'])
def delete_promotion():
    return promotion_model.delete_promotion(request.json)

@promotion_blueprint.route('/promotions/counts', methods=['GET'])
def count_promotions():
    return promotion_model.count_promotions()

@promotion_blueprint.route('/promotions/counts/<seller_id>', methods=['GET'])
def seller_count_promotions(seller_id):
    return promotion_model.seller_count_promotions(seller_id)

@promotion_blueprint.route('/promotions/activeCounts', methods=['GET'])
def active_promotions():
    return promotion_model.active_promotions()

@promotion_blueprint.route('/promotions/activeCounts/<seller_id>', methods=['GET'])
def seller_active_promotions(seller_id):
    return promotion_model.seller_active_promotions(seller_id)

@promotion_blueprint.route('/promotions/expiredCounts', methods=['GET'])
def expired_promotions():
    return promotion_model.expired_promotions()

@promotion_blueprint.route('/promotions/expiredCounts/<seller_id>', methods=['GET'])
def seller_expired_promotions(seller_id):
    return promotion_model.seller_expired_promotions(seller_id)

@promotion_blueprint.route('/promotions/avgDollar', methods=['GET'])
def avgdollar_promotions():
    return promotion_model.avgdollar_promotions()

@promotion_blueprint.route('/promotions/avgPercent', methods=['GET'])
def avgpercent_promotions():
    return promotion_model.avgpercent_promotions()
