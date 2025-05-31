# DateMate - Professional Marriage Matching Web Application

DateMate is a modern web application designed to help people find their perfect match through an intelligent matching system. The application features a beautiful user interface, secure authentication, and advanced matching algorithms.

## Features

- User Authentication System
  - Secure sign-up and login
  - JWT-based session management
  - Password encryption

- Modern User Interface
  - Responsive design
  - Beautiful gradients and animations
  - Intuitive navigation

- Advanced Matching System
  - Smart compatibility scoring
  - Detailed user preferences
  - Advanced filtering options

- Profile Management
  - Complete profile creation
  - Profile picture upload
  - Bio and interests sections

- Real-time Messaging
  - Instant message delivery
  - Message history
  - Read/unread status

- Admin Dashboard
  - User management
  - Match analytics
  - System configuration

## Tech Stack

### Frontend
- HTML5
- CSS3 with modern gradients
- JavaScript (ES6+)
- Bootstrap 5
- Font Awesome icons

### Backend
- Python
- Flask framework
- SQLAlchemy ORM
- JWT authentication
- MySQL database

## Prerequisites

- Python 3.8+
- MySQL 8.0+
- Node.js 14+ (for development tools)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/datemate.git
cd datemate
```

2. Set up the Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

4. Set up the MySQL database:
```bash
mysql -u root -p < database/schema.sql
```

5. Configure environment variables:
Create a `.env` file in the backend directory with the following content:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=datemate
JWT_SECRET_KEY=your_secret_key
```

6. Start the backend server:
```bash
cd backend
python app.py
```

7. Serve the frontend:
You can use any static file server. For development, you can use Python's built-in server:
```bash
cd frontend
python -m http.server 8000
```

## Project Structure

```
datemate/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   │   ├── style.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── main.js
│   │   └── dashboard.js
│   └── images/
├── database/
│   └── schema.sql
└── README.md
```

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login user
- GET /api/profile - Get user profile

### Matches
- GET /api/matches - Get potential matches
- POST /api/matches/filter - Filter matches
- POST /api/matches/like - Like a match

### Messages
- GET /api/conversations - Get user conversations
- GET /api/messages/{conversation_id} - Get conversation messages
- POST /api/messages - Send a message

### Profile
- PUT /api/profile - Update user profile
- POST /api/profile/picture - Update profile picture

## Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure file upload handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the frontend framework
- Font Awesome for the icons
- Flask for the backend framework
- MySQL for the database 