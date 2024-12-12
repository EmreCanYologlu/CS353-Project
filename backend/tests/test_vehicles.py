import pytest
from models import Vehicle, Bid

@pytest.fixture
def test_vehicle(db, test_user):
    vehicle = Vehicle(
        seller_id=test_user.id,
        make='Toyota',
        model='Camry',
        year=2020,
        mileage=50000,
        price=15000,
        condition='good',
        description='Test vehicle',
        initial_price=15000
    )
    db.session.add(vehicle)
    db.session.commit()
    return vehicle

def test_create_vehicle(client, auth_headers):
    response = client.post('/api/ads/vehicles', 
        headers=auth_headers,
        json={
            'make': 'Honda',
            'model': 'Civic',
            'year': 2019,
            'mileage': 45000,
            'price': 12000,
            'condition': 'excellent',
            'description': 'Well maintained'
        }
    )
    assert response.status_code == 201
    assert 'vehicle_id' in response.json

def test_get_vehicles(client):
    response = client.get('/api/ads/vehicles')
    assert response.status_code == 200
    assert 'vehicles' in response.json
    assert 'total' in response.json

def test_get_vehicle_detail(client, test_vehicle):
    response = client.get(f'/api/ads/vehicles/{test_vehicle.id}')
    assert response.status_code == 200
    assert response.json['make'] == 'Toyota'
    assert response.json['model'] == 'Camry'

def test_update_vehicle(client, auth_headers, test_vehicle):
    response = client.put(
        f'/api/ads/vehicles/{test_vehicle.id}',
        headers=auth_headers,
        json={'price': 14500}
    )
    assert response.status_code == 200
    assert 'message' in response.json

    # Verify update
    response = client.get(f'/api/ads/vehicles/{test_vehicle.id}')
    assert response.json['price'] == 14500

def test_delete_vehicle(client, auth_headers, test_vehicle):
    response = client.delete(
        f'/api/ads/vehicles/{test_vehicle.id}',
        headers=auth_headers
    )
    assert response.status_code == 200

    # Verify deletion
    response = client.get(f'/api/ads/vehicles/{test_vehicle.id}')
    assert response.status_code == 404

def test_create_bid(client, auth_headers, test_vehicle):
    response = client.post(
        f'/api/ads/vehicles/{test_vehicle.id}/bids',
        headers=auth_headers,
        json={
            'amount': 15500,
            'is_public': True
        }
    )
    assert response.status_code == 201
    assert 'bid_id' in response.json

def test_search_vehicles(client):
    response = client.get('/api/search', query_string={
        'q': 'Toyota',
        'year_min': 2018,
        'price_max': 20000
    })
    assert response.status_code == 200
    assert 'vehicles' in response.json

def test_predicted_value(client, test_vehicle):
    response = client.get(f'/api/ads/vehicles/{test_vehicle.id}')
    assert response.status_code == 200
    assert 'predicted_value' in response.json
    assert isinstance(response.json['predicted_value'], (int, float))

def test_invalid_vehicle_data(client, auth_headers):
    response = client.post('/api/ads/vehicles', 
        headers=auth_headers,
        json={
            'make': 'Honda',
            'model': 'Civic',
            'year': 3000,  # Invalid year
            'mileage': -1,  # Invalid mileage
            'price': 12000,
            'condition': 'invalid'  # Invalid condition
        }
    )
    assert response.status_code == 400
    assert 'error' in response.json