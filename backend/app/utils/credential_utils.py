import bcrypt
import jwt
import os
import datetime

from dotenv import load_dotenv

from .db_utils import get_db_connection
from .data_fetch import get_admin

def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode('utf-8')


def check_credentials(username=None, password=None):
    if (not username or not password):
        return False

    admin_info = get_admin(username)
    if (not admin_info):
        return False

    password_bytes = password.encode('utf-8')
    hashed_bytes = admin_info[1].encode('utf-8')

    return bcrypt.checkpw(password_bytes, hashed_bytes)

def get_token(username):
    load_dotenv()
    secret_key = os.getenv('SECRET_KEY')

    payload = {
            'username': username,
        }
    token = jwt.encode(payload, secret_key, algorithm='HS256')

    return token