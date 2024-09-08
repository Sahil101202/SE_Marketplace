from functools import wraps
import mysql.connector
import json
from flask import make_response, request
import jwt 
import re
from config.config import get_connection 

class auth():

    def __init__(self):
        try:
            self.con = get_connection()
            self.con.autocommit = True
            self.cur = self.con.cursor(dictionary=True)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            self.cur = None

    def token_auth(self, endpoint=""):
        def inner1(func):
            @wraps(func)
            def inner2(*args, **kwargs):
                endpoint = request.url_rule
                endpoint_str = str(endpoint)
                authorization = request.headers.get("Authorization")
                if re.match("^Bearer *([^ ]+) *$", authorization, flags=0):
                    token = authorization.split(" ")[1]
                    print(token)
                    # return func(*args, *kwargs)
                    if token:
                        try:
                            jwtdecoded = jwt.decode(token, 'sahil101202', algorithms="HS256")
                        except jwt.ExpiredSignatureError:
                            return make_response({'responce':False, 'message':'Token Expired!!'}, 401)
                        role_id = jwtdecoded['role_id']
                        self.cur.execute("SELECT roles FROM endpoint_accessibility WHERE endpoint=%s", (endpoint_str,))
                        result = self.cur.fetchall()

                        if len(result)>0:
                            allowed_roles = result[0]['roles']
                            roles_list = json.loads(allowed_roles)
                            if role_id in roles_list:
                                return func(*args, **kwargs)
                            else:
                                return make_response({'responce':False, 'message':'Unauthorized User!!'}, 404)
                        else:
                            return make_response({'responce':False, 'message':'Unknown Endpoint!!'}, 404)
                        
                    else:
                        return make_response({'responce':False, 'message':'Invalid Token!!'}, 401)
                else:
                    return make_response({'responce':False, 'message':'Invalid Token!!'}, 401)
            return inner2
        return inner1
    


