# controller/email_controller.py
from flask import Blueprint, request, make_response
from email_model import send_email, generate_invoice, create_email_content

email_bp = Blueprint('email', __name__)

@email_bp.route('/send-email', methods=['POST'])
def send_order_confirmation_email():
    data = request.json
    recipient_email = data['email']
    products = data['products']  # Ensure products list is passed in the request data

    if not (recipient_email and products):
        return make_response({'status': False, 'error': 'Incomplete data provided'}, 400)

    subject = "Order Confirmation and Invoice"
    invoice_html = generate_invoice(products)
    invoice_plain_text = "Here is your order invoice:\n\n"  # Provide a plain text version if needed

    try:
        send_email(subject, [recipient_email], invoice_html, invoice_plain_text)
        return make_response({'status': True, 'message': 'Email sent successfully'}, 200)
    except Exception as e:
        return make_response({'status': False, 'error': str(e)}, 500)
    


@email_bp.route('/send-promotion', methods=['POST'])
def send_promotion_email():
    data = request.json
    subject = 'Promotion details'
    email_content = data.get('content')
    recipients = data.get('recipients')
    mails = []
    for i in recipients:
        mails.append(i['email'])

    if not (subject and email_content and recipients):
        return make_response({'status': False, 'error': 'Incomplete data provided'}, 400)

    try:
        # Iterate through recipients and send email to each
        for recipient_email in mails:
            send_email(subject, [recipient_email], email_content)  # Use send_email function with a list of recipients
        
        return make_response({'status': True, 'message': 'Promotional emails sent successfully'}, 200)
    except Exception as e:
        return make_response({'status': False, 'error': str(e)}, 500)


@email_bp.route('/send-contact', methods=['POST'])
def send_contact_email():
    data = request.json
    user_email = data['email']
    subject = 'Contact details'
    recipients = 'uniclothes.service@gmail.com'
    email_content = create_email_content(data)

    if not (subject and email_content and recipients and user_email):
        return make_response({'status': False, 'message': 'Incomplete data provided'}, 400)
    
    try :
        send_email(subject, [recipients], email_content)
        return make_response({'status': True, 'message': 'Contact emails sent successfully'}, 200)
    except Exception as e:
        return make_response({'status': False, 'message': str(e)}, 500)

    