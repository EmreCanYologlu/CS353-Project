import pytest
from app import create_app
from models import db as _db, User
from flask_jwt_extended import create_access_token

@pytest.fixture
def app():
    app = create_app('testing')
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db(app):
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.close()
        _db.drop_all()

@pytest.fixture
def test_user(db):
    user = User(
        username='testuser',
        email='test@example.com',
        is_admin=False
    )
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture
def admin_user(db):
    admin = User(
        username='admin',
        email='admin@example.com',
        is_admin=True
    )
    admin.set_password('admin123')
    db.session.add(admin)
    db.session.commit()
    return admin

@pytest.fixture
def auth_headers(app, test_user):
    access_token = create_access_token(identity=test_user.id)
    return {'Authorization': f'Bearer {access_token}'}

@pytest.fixture
def admin_headers(app, admin_user):
    access_token = create_access_token(identity=admin_user.id)
    return {'Authorization': f'Bearer {access_token}'}