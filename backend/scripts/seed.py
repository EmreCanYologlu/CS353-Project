import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models import db, User, Vehicle, Bid, Rating
from datetime import datetime, timedelta
import random

def create_sample_data():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.session.query(Rating).delete()
        db.session.query(Bid).delete()
        db.session.query(Vehicle).delete()
        db.session.query(User).delete()
        db.session.commit()

        # Create admin user
        admin = User(
            username='admin',
            email='admin@example.com',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)

        # Create regular users
        users = []
        for i in range(5):
            user = User(
                username=f'user{i}',
                email=f'user{i}@example.com',
                is_admin=False
            )
            user.set_password('password123')
            users.append(user)
            db.session.add(user)

        db.session.commit()

        # Sample vehicle data
        vehicles = [
            {
                'make': 'Toyota',
                'models': ['Camry', 'Corolla', 'RAV4', 'Highlander'],
                'conditions': ['excellent', 'good'],
                'price_range': (15000, 35000)
            },
            {
                'make': 'Honda',
                'models': ['Civic', 'Accord', 'CR-V', 'Pilot'],
                'conditions': ['excellent', 'good', 'fair'],
                'price_range': (12000, 38000)
            },
            {
                'make': 'Ford',
                'models': ['F-150', 'Explorer', 'Escape', 'Mustang'],
                'conditions': ['good', 'fair'],
                'price_range': (18000, 45000)
            },
            {
                'make': 'BMW',
                'models': ['3 Series', '5 Series', 'X3', 'X5'],
                'conditions': ['excellent', 'good'],
                'price_range': (25000, 60000)
            },
        ]

        # Create vehicles
        created_vehicles = []
        for user in users:
            for _ in range(random.randint(2, 4)):
                vehicle_type = random.choice(vehicles)
                price = random.randint(*vehicle_type['price_range'])
                vehicle = Vehicle(
                    seller_id=user.id,
                    make=vehicle_type['make'],
                    model=random.choice(vehicle_type['models']),
                    year=random.randint(2015, 2023),
                    mileage=random.randint(10000, 100000),
                    price=price,
                    initial_price=price,
                    condition=random.choice(vehicle_type['conditions']),
                    description=f"A great {vehicle_type['make']} vehicle in {random.choice(vehicle_type['conditions'])} condition.",
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
                )
                created_vehicles.append(vehicle)
                db.session.add(vehicle)

        db.session.commit()

        # Create bids
        for vehicle in created_vehicles:
            num_bids = random.randint(0, 4)
            current_price = vehicle.price
            for _ in range(num_bids):
                bidder = random.choice([u for u in users if u.id != vehicle.seller_id])
                bid_amount = current_price + random.randint(100, 1000)
                bid = Bid(
                    vehicle_id=vehicle.id,
                    bidder_id=bidder.id,
                    amount=bid_amount,
                    status='pending',
                    is_public=random.choice([True, False]),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 15))
                )
                current_price = bid_amount
                db.session.add(bid)

        # Create ratings
        for user in users:
            for _ in range(random.randint(1, 3)):
                rater = random.choice([u for u in users if u.id != user.id])
                rating = Rating(
                    seller_id=user.id,
                    rater_id=rater.id,
                    rating=random.randint(3, 5),
                    review=f"Great seller! Transaction was smooth.",
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
                )
                db.session.add(rating)

        db.session.commit()
        print("Sample data created successfully!")

if __name__ == '__main__':
    create_sample_data()