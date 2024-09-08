from flask import Flask, request, jsonify
import stripe

# Set your secret key. Remember to switch to your live secret key in production!
stripe.api_key = 'sk_test_51PUYzSDxa2xNsUeMK90pm4ounZgnzIcwXrbcW9GAPB4hzwtAcrNzBVlqy3CBI5rbCYeq28FwGYkChL4kzeDZDPRF00sgbU2TGd'

class StripeModel:
    @staticmethod
    def create_checkout_session(data):
        try:
            cart_items = data['data']
            line_items = [{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item['name'],
                    },
                    'unit_amount': int(item['price'] * 100),
                },
                'quantity': item['qty'],
            } for item in cart_items]
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:8080/',
                cancel_url='http://localhost:8080/',
            )
            return jsonify(id=session.id)
        
        except stripe.error.StripeError as e:
            return jsonify(error=str(e)), 400

        except Exception as e:
            return jsonify(error="An error occurred"), 500

