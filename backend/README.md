# EduStream Backend

Node.js + Express + MySQL backend for the EduStream webinar management platform.

## Features

- User authentication with JWT
- Webinar CRUD operations
- User registration for webinars
- Wishlist management
- Assignment and submission tracking
- Review and rating system
- Admin dashboard functionality

## Prerequisites

- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Update the `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edustream
DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Create Database

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the SQL schema:
```bash
mysql -u root -p edustream < database.sql
```

Or manually run the SQL commands from `database.sql` in your MySQL client.

### 4. Install nodemon (optional, for development)

```bash
npm install -g nodemon
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will run on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires token)

### Webinars
- `GET /api/webinars` - Get all webinars
- `GET /api/webinars/:id` - Get webinar by ID
- `GET /api/webinars/search?search=query` - Search webinars
- `POST /api/webinars` - Create webinar (admin only)
- `PUT /api/webinars/:id` - Update webinar (admin only)
- `DELETE /api/webinars/:id` - Delete webinar (admin only)

### Registrations
- `POST /api/registrations/register` - Register for webinar
- `GET /api/registrations/my-registrations` - Get my registrations
- `DELETE /api/registrations/unregister/:webinarId` - Unregister from webinar
- `POST /api/registrations/wishlist` - Add to wishlist
- `DELETE /api/registrations/wishlist/:webinarId` - Remove from wishlist
- `GET /api/registrations/wishlist/my-wishlist` - Get my wishlist

### Assignments
- `POST /api/assignments` - Create assignment (admin only)
- `GET /api/assignments/webinar/:webinarId` - Get assignments for webinar
- `PUT /api/assignments/:id` - Update assignment (admin only)
- `DELETE /api/assignments/:id` - Delete assignment (admin only)

### Submissions
- `POST /api/submissions/submit` - Submit assignment
- `GET /api/submissions/my-submissions` - Get my submissions
- `GET /api/submissions/assignment/:assignmentId` - Get submissions for assignment (admin only)
- `PUT /api/submissions/grade/:id` - Grade submission (admin only)

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/webinar/:webinarId` - Get reviews for webinar
- `GET /api/reviews/rating/:webinarId` - Get average rating for webinar
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Authentication

Most endpoints require a JWT token. Include it in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

The database includes the following tables:
- `users` - User accounts with authentication
- `webinars` - Webinar information
- `registrations` - User registrations for webinars
- `wishlist` - User wishlist
- `assignments` - Webinar assignments
- `submissions` - Assignment submissions
- `reviews` - Webinar reviews and ratings

## Project Structure

```
backend/
├── server.js              # Main server file
├── db.js                  # Database connection
├── package.json           # Dependencies
├── .env.example           # Environment variables template
├── database.sql           # Database schema
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── controllers/
│   ├── authController.js
│   ├── webinarController.js
│   ├── registrationController.js
│   ├── assignmentController.js
│   ├── submissionController.js
│   └── reviewController.js
└── routes/
    ├── auth.js
    ├── webinars.js
    ├── registrations.js
    ├── assignments.js
    ├── submissions.js
    └── reviews.js
```

## Connecting from Frontend

Update your frontend API calls to use `http://localhost:5000/api/` as the base URL.

Example:
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database `edustream` exists

### CORS Issues
- CORS is already enabled in server.js
- If issues persist, update the CORS configuration in server.js

### Token Expired
- Get a new token by logging in again

## Development Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- Error handling is implemented for most endpoints
- Database queries use parameterized statements to prevent SQL injection

## License

MIT
