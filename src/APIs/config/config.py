
import mysql.connector
from app import app

db_config = {
    'host': 'mysql_se',
    'user': 'sahil',
    'password': '101202',
    'database': 'software_engineering',
    'connection_timeout': 800,
    'use_pure': True
}

conn = mysql.connector.connect(**db_config)

# @app.route('/db_connection', methods=['GET'])
def get_connection():
    if conn:
        # return 'Connected!!'
        print("DataBAse connection Done!!!!!!!")
        return conn
    else:
        return "Not Connected !!"


