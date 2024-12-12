from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Rating, User, Notification
from utils import admin_required

ratings = Blueprint('ratings', __name__)

@ratings.route('/ratings', methods=['POST'])
@jwt_required()
def create_rating():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if seller exists
    seller = User.query.get_or_404(data['seller_id'])
    
    # Check if rating already exists
    existing_rating = Rating.query.filter_by(
        seller_id=data['seller_id'],
        rater_id=current_user_id
    ).first()
    
    if existing_rating:
        return jsonify({'error': 'You have already rated this seller'}), 400
    
    rating = Rating(
        seller_id=data['seller_id'],
        rater_id=current_user_id,
        rating=data['rating'],
        review=data.get('review', '')
    )
    
    # Create notification for seller
    notification = Notification(
        user_id=seller.id,
        message=f"You received a new {rating.rating}-star rating",
        type='new_rating'
    )
    
    db.session.add(rating)
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'Rating submitted successfully',
        'rating_id': rating.id
    }), 201

@ratings.route('/ratings/<int:seller_id>', methods=['GET'])
def get_seller_ratings(seller_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    ratings = Rating.query.filter_by(seller_id=seller_id)\
        .paginate(page=page, per_page=per_page)
    
    # Calculate average rating
    avg_rating = db.session.query(db.func.avg(Rating.rating))\
        .filter_by(seller_id=seller_id)\
        .scalar() or 0
    
    return jsonify({
        'ratings': [{
            'id': r.id,
            'rating': r.rating,
            'review': r.review,
            'created_at': r.created_at.isoformat(),
            'rater': {
                'id': r.rater_id,
                'username': User.query.get(r.rater_id).username
            }
        } for r in ratings.items],
        'average_rating': float(avg_rating),
        'total_ratings': ratings.total,
        'pages': ratings.pages,
        'current_page': ratings.page
    })

@ratings.route('/ratings/<int:rating_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_rating(rating_id):
    rating = Rating.query.get_or_404(rating_id)
    db.session.delete(rating)
    db.session.commit()
    return jsonify({'message': 'Rating deleted successfully'})

@ratings.route('/users/<int:user_id>/rating-summary', methods=['GET'])
def get_user_rating_summary(user_id):
    # Get rating statistics
    result = db.session.query(
        db.func.count(Rating.id).label('total_ratings'),
        db.func.avg(Rating.rating).label('average_rating'),
        db.func.count(db.case([(Rating.rating == 5, 1)])).label('five_star'),
        db.func.count(db.case([(Rating.rating == 4, 1)])).label('four_star'),
        db.func.count(db.case([(Rating.rating == 3, 1)])).label('three_star'),
        db.func.count(db.case([(Rating.rating == 2, 1)])).label('two_star'),
        db.func.count(db.case([(Rating.rating == 1, 1)])).label('one_star')
    ).filter(Rating.seller_id == user_id).first()
    
    return jsonify({
        'total_ratings': result.total_ratings,
        'average_rating': float(result.average_rating or 0),
        'rating_distribution': {
            '5': result.five_star,
            '4': result.four_star,
            '3': result.three_star,
            '2': result.two_star,
            '1': result.one_star
        }
    })