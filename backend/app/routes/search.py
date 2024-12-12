from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from models import Vehicle, User
from utils import admin_required

search = Blueprint('search', __name__)

@search.route('/search', methods=['GET'])
def search_vehicles():
    query = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Build search query
    search_query = Vehicle.query.filter(
        or_(
            Vehicle.make.ilike(f'%{query}%'),
            Vehicle.model.ilike(f'%{query}%'),
            Vehicle.description.ilike(f'%{query}%')
        )
    )
    
    # Apply filters
    filters = {
        'make': Vehicle.make.ilike,
        'model': Vehicle.model.ilike,
        'year_min': lambda x: Vehicle.year >= int(x),
        'year_max': lambda x: Vehicle.year <= int(x),
        'price_min': lambda x: Vehicle.price >= float(x),
        'price_max': lambda x: Vehicle.price <= float(x),
        'condition': Vehicle.condition.ilike,
        'mileage_min': lambda x: Vehicle.mileage >= int(x),
        'mileage_max': lambda x: Vehicle.mileage <= int(x)
    }
    
    for param, filter_func in filters.items():
        if param in request.args:
            if param in ['make', 'model', 'condition']:
                search_query = search_query.filter(filter_func(f"%{request.args[param]}%"))
            else:
                search_query = search_query.filter(filter_func(request.args[param]))
    
    # Apply sorting
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')
    
    if hasattr(Vehicle, sort_by):
        if sort_order == 'desc':
            search_query = search_query.order_by(getattr(Vehicle, sort_by).desc())
        else:
            search_query = search_query.order_by(getattr(Vehicle, sort_by).asc())
    
    # Paginate results
    vehicles = search_query.paginate(page=page, per_page=per_page)
    
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

@search.route('/search/suggestions', methods=['GET'])
def get_search_suggestions():
    query = request.args.get('q', '').lower()
    
    if not query:
        return jsonify({'suggestions': []})
    
    # Get unique makes and models that match the query
    makes = Vehicle.query.with_entities(Vehicle.make)\
        .filter(Vehicle.make.ilike(f'%{query}%'))\
        .distinct()\
        .limit(5)\
        .all()
    
    models = Vehicle.query.with_entities(Vehicle.model)\
        .filter(Vehicle.model.ilike(f'%{query}%'))\
        .distinct()\
        .limit(5)\
        .all()
    
    suggestions = {
        'makes': [make[0] for make in makes],
        'models': [model[0] for model in models]
    }
    
    return jsonify({'suggestions': suggestions})

@search.route('/search/popular', methods=['GET'])
def get_popular_searches():
    # Get top makes
    popular_makes = Vehicle.query.with_entities(
        Vehicle.make, 
        db.func.count(Vehicle.id).label('count')
    ).group_by(Vehicle.make)\
    .order_by(db.func.count(Vehicle.id).desc())\
    .limit(5)\
    .all()
    
    # Get price ranges
    price_ranges = [
        {'min': 0, 'max': 10000},
        {'min': 10000, 'max': 20000},
        {'min': 20000, 'max': 30000},
        {'min': 30000, 'max': 50000},
        {'min': 50000, 'max': None}
    ]
    
    return jsonify({
        'popular_makes': [{
            'make': make,
            'count': count
        } for make, count in popular_makes],
        'price_ranges': price_ranges
    })