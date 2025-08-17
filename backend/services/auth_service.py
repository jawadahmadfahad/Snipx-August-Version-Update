import jwt
import bcrypt
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os

class AuthService:
    def __init__(self, db):
        self.db = db
        self.users = db.users
        self.secret_key = os.getenv('JWT_SECRET_KEY', 'your-default-secret-key-change-this-in-production')
        
        # Ensure we have a valid string secret key
        if not self.secret_key or not isinstance(self.secret_key, str):
            self.secret_key = 'your-default-secret-key-change-this-in-production'

    def register_user(self, email, password, first_name=None, last_name=None):
        if self.users.find_one({"email": email}):
            raise ValueError("Email already registered")

        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        user_doc = {
            "email": email,
            "password_hash": password_hash,
            "first_name": first_name,
            "last_name": last_name,
            "created_at": datetime.utcnow()
        }
        result = self.users.insert_one(user_doc)
        return str(result.inserted_id)

    def login_user(self, email, password):
        # Fetch raw user document
        user_doc = self.users.find_one({"email": email})
        if not user_doc:
            raise ValueError("Invalid email or password")

        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user_doc['password_hash']):
            raise ValueError("Invalid email or password")

        # Generate JWT
        token = self.generate_token(str(user_doc['_id']))

        # Build JSON-serializable user dict
        user_data = {
            'id': str(user_doc['_id']),
            'email': user_doc['email'],
            'firstName': user_doc.get('first_name'),
            'lastName': user_doc.get('last_name')
        }

        return token, user_data

    def generate_token(self, user_id):
        try:
            payload = {
                'user_id': str(user_id),  # Ensure user_id is a string
                'exp': datetime.utcnow() + timedelta(days=1)
            }
            return jwt.encode(payload, self.secret_key, algorithm='HS256')
        except Exception as e:
            raise ValueError(f"Failed to generate token: {str(e)}")

    def verify_token(self, token):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")

    def get_user_by_id(self, user_id):
        from models.user import User  # import here to avoid circular
        user_doc = self.users.find_one({"_id": ObjectId(user_id)})
        if not user_doc:
            raise ValueError("User not found")
        return User.from_dict(user_doc)

    def update_user(self, user_id, updates):
        updates['updated_at'] = datetime.utcnow()
        result = self.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )
        if result.modified_count == 0:
            raise ValueError("User not found or no changes made")
        return self.get_user_by_id(user_id)
