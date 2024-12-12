from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def format_currency(amount):
    return "${:,.2f}".format(float(amount))

def calculate_pagination(page, total_items, per_page):
    total_pages = (total_items + per_page - 1) // per_page
    has_next = page < total_pages
    has_prev = page > 1
    
    return {
        'total_pages': total_pages,
        'current_page': page,
        'has_next': has_next,
        'has_prev': has_prev,
        'total_items': total_items
    }

def validate_vehicle_data(data):
    required_fields = ['make', 'model', 'year', 'mileage', 'price', 'condition']
    errors = []
    
    for field in required_fields:
        if field not in data:
            errors.append(f"{field} is required")
    
    if 'year' in data:
        try:
            year = int(data['year'])
            if year < 1900 or year > 2100:
                errors.append("Invalid year")
        except ValueError:
            errors.append("Year must be a number")
    
    if 'mileage' in data:
        try:
            mileage = int(data['mileage'])
            if mileage < 0:
                errors.append("Mileage cannot be negative")
        except ValueError:
            errors.append("Mileage must be a number")
    
    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0:
                errors.append("Price cannot be negative")
        except ValueError:
            errors.append("Price must be a number")
    
    if 'condition' in data and data['condition'] not in ['excellent', 'good', 'fair', 'poor']:
        errors.append("Invalid condition value")
    
    return errors

def validate_bid_data(data, vehicle):
    errors = []
    
    if 'amount' not in data:
        errors.append("Bid amount is required")
    else:
        try:
            amount = float(data['amount'])
            if amount <= 0:
                errors.append("Bid amount must be positive")
            if amount <= float(vehicle.price):
                errors.append("Bid amount must be higher than current price")
        except ValueError:
            errors.append("Bid amount must be a number")
    
    return errors