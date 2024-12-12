from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from models import db
from auth import auth
from ads import ads
from ratings import ratings
from search import search

def create_app(config=None):
    app = Flask(__name__)
    
    # Configure app
    app.config.update(
        SQLALCHEMY_DATABASE_URI='postgresql://username:password@localhost/cardb',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY='your-secret-key',  # Change this in production
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=24)
    )
    
    if config:
        app.config.update(config)
    
    # Initialize extensions
    CORS(app)
    JWTManager(app)
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(ads, url_prefix='/api/ads')
    app.register_blueprint(ratings, url_prefix='/api/ratings')
    app.register_blueprint(search, url_prefix='/api/search')
    
    @app.before_first_request
    def create_tables():
        db.create_all()
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)