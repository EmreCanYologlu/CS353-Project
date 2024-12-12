from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Vehicle, Bid, Notification
from utils import admin_required

ads = Blueprint('ads', __name__)

@ads.route('/vehicles', methods=['POST'])
@jwt_required()
def create_vehicle():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    vehicle = Vehicle(
        seller_id=current_user_id,
        make=data['make'],
        model=data['model'],
        year=data['year'],
        mileage=data['mileage'],
        price=data['price'],
        condition=data['condition'],
        description=data.get('description'),
        initial_price=data['price']
    )
    
    db.session.add(vehicle)
    db.session.commit()
    
    return jsonify({
        'message': 'Vehicle listed successfully',
        'vehicle_id': vehicle.id
    }), 201

@ads.route('/vehicles', methods=['GET'])
def get_vehicles():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    query = Vehicle.query
    
    # Apply filters
    if 'make' in request.args:
        query = query.filter(Vehicle.make.ilike(f"%{request.args['make']}%"))
    if 'model' in request.args:
        query = query.filter(Vehicle.model.ilike(f"%{request.args['model']}%"))
    if 'year_min' in request.args:
        query = query.filter(Vehicle.year >= request.args['year_min'])
    if 'year_max' in request.args:
        query = query.filter(Vehicle.year <= request.args['year_max'])
    if 'price_min' in request.args:
        query = query.filter(Vehicle.price >= request.args['price_min'])
    if 'price_max' in request.args:
        query = query.filter(Vehicle.price <= request.args['price_max'])
    
    vehicles = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'vehicles': [{
            'id': v.id,
            'make': v.make,
            'model': v.model,
            'year': v.year,
            'mileage': v.mileage,
            'price': float(v.price),
            'condition': v.condition,
            'description': v.description,
            'status': v.status,
            'created_at': v.created_at.isoformat(),
            'predicted_value': v.calculate_predicted_value(),
            'seller': {
                'id': v.seller.id,
                'username': v.seller.username
            }
        } for v in vehicles.items],
        'total': vehicles.total,
        'pages': vehicles.pages,
        'current_page': vehicles.page
    })

@ads.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    
    return jsonify({
        'id': vehicle.id,
        'make': vehicle.make,
        'model': vehicle.model,
        'year': vehicle.year,
        'mileage': vehicle.mileage,
        'price': float(vehicle.price),
        'condition': vehicle.condition,
        'description': vehicle.description,
        'status': vehicle.status,
        'created_at': vehicle.created_at.isoformat(),
        'predicted_value': vehicle.calculate_predicted_value(),
        'seller': {
            'id': vehicle.seller.id,
            'username': vehicle.seller.username
        },
        'bids': [{
            'id': bid.id,
            'amount': float(bid.amount),
            'status': bid.status,
            'created_at': bid.created_at.isoformat(),
            'bidder': {
                'id': bid.bidder.id,
                'username': bid.bidder.username
            }
        } for bid in vehicle.bids if bid.is_public]
    })

@ads.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
@jwt_required()
def update_vehicle(vehicle_id):
    current_user_id = get_jwt_identity()
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    
    if vehicle.seller_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    for field in ['make', 'model', 'year', 'mileage', 'price', 'condition', 'description']:
        if field in data:
            setattr(vehicle, field, data[field])
    
    db.session.commit()
    return jsonify({'message': 'Vehicle updated successfully'})

@ads.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])
@jwt_required()
def delete_vehicle(vehicle_id):
    current_user_id = get_jwt_identity()
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    
    if vehicle.seller_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({'message': 'Vehicle deleted successfully'})

@ads.route('/vehicles/<int:vehicle_id>/bids', methods=['POST'])
@jwt_required()
def create_bid(vehicle_id):
    current_user_id = get_jwt_identity()
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    
    if vehicle.seller_id == current_user_id:
        return jsonify({'error': 'Cannot bid on your own vehicle'}), 400
    
    data = request.get_json()
    bid = Bid(
        vehicle_id=vehicle_id,
        bidder_id=current_user_id,
        amount=data['amount'],
        is_public=data.get('is_public', True)
    )
    
    db.session.add(bid)
    
    # Create notification for seller
    notification = Notification(
        user_id=vehicle.seller_id,
        message=f"New bid of ${data['amount']} on your {vehicle.year} {vehicle.make} {vehicle.model}",
        type='new_bid'
    )
    db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Bid placed successfully',
        'bid_id': bid.id
    }), 201