from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from config import config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    
    # Register blueprints
    from app.routes.auth import auth
    from app.routes.ads import ads
    from app.routes.ratings import ratings
    from app.routes.search import search
    
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(ads, url_prefix='/api/ads')
    app.register_blueprint(ratings, url_prefix='/api/ratings')
    app.register_blueprint(search, url_prefix='/api/search')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app