
from flask import Flask, render_template, request, flash
from flask_mail import Mail, Message
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})


# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587  # or another port if your provider requires it
app.config['MAIL_USE_TLS'] = True  # Enable TLS encryption
app.config['MAIL_USERNAME'] = 'uniclothes.service@gmail.com'  # Your email address
app.config['MAIL_PASSWORD'] = 'gymtmeerfhyqgfqc'  # Your email password
app.config['MAIL_DEFAULT_SENDER'] = 'uniclothes.service@gmail.com'  # Default sender (From address)
app.config['MAIL_DEBUG'] = True

# Initialize Flask-Mail
mail = Mail(app)


from email_controller import email_bp
app.register_blueprint(email_bp)

# # Route to send email
# @app.route('/send-email', methods=['GET', 'POST'])
# def send_email():
#     if request.method == 'POST':
#         recipient = 'sahil.nakrani1012@gmail.com'
#         subject = 'testing'
#         body = "hi i'm sahil nakrani"

#         # try:
#         msg = Message(subject=subject, recipients=[recipient], body=body)
#         mail.send(msg)
#         flash('Email sent successfully!', 'success')
#         # except Exception as e:
#         #     flash(f'Failed to send email. Error: {str(e)}', 'error')

#     return 'sent email'

if __name__ == '__main__':
    app.run(debug=True)

