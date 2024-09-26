from flask_mail import Message
from app import mail

def send_email(subject, recipients, html_body, plain_text_body=None):
    msg = Message(subject, recipients=recipients)

    # Attach both HTML and plain text versions
    msg.html = html_body
    msg.body = plain_text_body or 'This is your order invoice. Please enable HTML to view.'

    mail.send(msg)


# model/email_model.py
def generate_invoice(products):
    total_amount = 0

    invoice_body = """
    <html>
    <body>
        <h2>Order Invoice</h2>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Product Name</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center;">Price</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center;">Quantity</th>
                <th style="border: 1px solid #dddddd; padding: 8px; text-align: right;">Total</th>
            </tr>
    """

    for product in products:
        product_name = product['name']
        product_price = product['price']
        product_quantity = product['qty']
        product_total = product_price * product_quantity
        total_amount += product_total

        invoice_body += f"""
            <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">{product_name}</td>
                <td style="border: 1px solid #dddddd; text-align: center; padding: 8px;">${product_price:.2f}</td>
                <td style="border: 1px solid #dddddd; text-align: center; padding: 8px;">{product_quantity}</td>
                <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;">${product_total:.2f}</td>
            </tr>
        """

    invoice_body += f"""
            <tr>
                <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total Amount:</strong></td>
                <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;">${total_amount:.2f}</td>
            </tr>
        </table>
        <p>Thank you for your order!</p>
        <p>UniClothes Team</p>
    </body>
    </html>
    """

    return invoice_body


def create_email_content(form_data):
    # Extract data from form
    name = form_data['name']
    street = form_data['street']
    city = form_data['city']
    postcode = form_data['postcode']
    phone = form_data['phone']
    email = form_data['email']
    message = form_data['message']

    # Create a formatted email body
    email_content = f"""
        <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <p>A new contact form submission has been received. Below are the details:</p>
            
            <h3>Contact Information</h3>
            <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Name:</strong> {name}</li>
                <li><strong>Phone:</strong> {phone}</li>
                <li><strong>Email:</strong> {email}</li>
            </ul>
            
            <h3>Address</h3>
            <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Street:</strong> {street}</li>
                <li><strong>City:</strong> {city}</li>
                <li><strong>Postcode:</strong> {postcode}</li>
            </ul>

            <h3>Message</h3>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #007BFF;">{message}</p>

            <p>------------------------------------</p>
            <p style="font-size: 12px; color: #888;">This email was automatically generated from a contact form submission.</p>
        </body>
        </html>
    """


    return email_content


