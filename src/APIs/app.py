from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": "*"
    }
})

# from config.config import get_connection
from controller.user_controller import user_blueprint  # Ensure user_controller is properly imported
from controller.product_controller import product_blueprint
from controller.cart_controller import cart_blueprint
from controller.order_controller import order_blueprint
from controller.promotion_controller import promotion_blueprint
from controller.stripe_controller import stripe_blueprint

app.register_blueprint(user_blueprint)
app.register_blueprint(product_blueprint)
app.register_blueprint(cart_blueprint)
app.register_blueprint(promotion_blueprint)
app.register_blueprint(order_blueprint)
app.register_blueprint(stripe_blueprint)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
