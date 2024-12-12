# CarMarket - Vehicle Marketplace Application

A full-stack web application for buying and selling vehicles, built with Flask, React, and PostgreSQL.

## Features

- User authentication and authorization
- Vehicle listings with advanced search and filtering
- Bidding system
- Rating and review system
- Admin dashboard
- Real-time notifications
- Responsive design

## Technology Stack

### Backend
- Flask (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Gunicorn (WSGI server)

### Frontend
- React (UI library)
- TypeScript
- Tailwind CSS (Styling)
- React Query (Data fetching)
- React Router (Routing)
- React Hook Form (Forms)
- Lucide Icons

### DevOps
- Docker
- Nginx
- Redis (Caching)

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/car-market.git
cd car-market
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env  # Update with your configurations
flask db upgrade
```

3. Set up the frontend:
```bash
cd frontend
npm install
cp .env.template .env  # Update with your configurations
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
flask run
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Production Mode (Docker)

```bash
docker-compose up --build
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
car-market/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   └── utils/
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── config.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── services/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
```

### Vehicle Endpoints

```
GET /api/ads/vehicles
POST /api/ads/vehicles
GET /api/ads/vehicles/:id
PUT /api/ads/vehicles/:id
DELETE /api/ads/vehicles/:id
```

### Bid Endpoints

```
POST /api/ads/vehicles/:id/bids
GET /api/ads/vehicles/:id/bids
```

### Rating Endpoints

```
POST /api/ratings
GET /api/ratings/:sellerId
GET /api/users/:userId/rating-summary
```

### Search Endpoints

```
GET /api/search
GET /api/search/suggestions
GET /api/search/popular
```

## Environment Variables

### Backend (.env)

```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cardb
JWT_SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379/0
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Flask](https://flask.palletsprojects.com/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/car-market
```