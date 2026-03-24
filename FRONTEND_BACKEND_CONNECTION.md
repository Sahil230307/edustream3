# Frontend-Backend Connection Guide

The frontend is now connected to the backend API. Follow these steps to run both together.

## Prerequisites

- **Node.js** (v16+) installed
- **MySQL** running and properly configured
- Backend package dependencies installed
- Frontend package dependencies installed

## Setup Steps

### 1. Setup Backend

```bash
cd backend
npm install
```

Configure `.env`:
```bash
cp .env.example .env
```

Update `.env` with your MySQL credentials:
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

Create database and import schema:
```bash
mysql -u root -p
mysql> CREATE DATABASE edustream;
mysql> exit

mysql -u root -p edustream < database.sql
```

### 2. Setup Frontend

```bash
# Make sure you're in the root directory (edustream3)
npm install
```

## Running Both Server and Frontend

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173 (or similar)
```

### Option 2: Single Terminal with Concurrently

Install concurrently:
```bash
npm install -D concurrently
```

Update root `package.json` scripts:
```json
{
  "scripts": {
    "dev": "concurrently \"npm -C backend run dev\" \"npm run dev\"",
    "start": "concurrently \"npm -C backend start\" \"npm run build && npm run preview\""
  }
}
```

Then run:
```bash
npm run dev
```

## API Integration Points

### Key Files Modified:
- **src/services/api.js** - API utility with all endpoints
- **src/pages/Login.jsx** - Now calls backend for authentication
- **src/pages/Signup.jsx** - Now calls backend for user creation
- **src/App.jsx** - Fetches webinars from API
- **src/pages/Dashboard.jsx** - Fetches user registrations from API
- **src/components/Navbar.jsx** - Clears JWT token on logout

### Authentication Flow:
1. User signs up → Backend creates account with hashed password
2. User logs in → Backend validates and returns JWT token
3. Token is stored in localStorage and sent with each API request
4. Token expires after 24 hours

## Testing the Connection

### 1. Check Backend Health
```
GET http://localhost:5000/api/health
```

Should return:
```json
{ "status": "Backend is running" }
```

### 2. Test Signup
```
POST http://localhost:5000/api/auth/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### 3. Test Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token.

### 4. Try in Frontend
- Open http://localhost:5173
- Click "Sign Up"
- Create an account
- Login and verify you're redirected to your dashboard

## Database Population

To add sample webinars, use the MySQL client or a tool like Postman with an admin token:

```bash
mysql -u root -p edustream
```

Then insert sample data:
```sql
INSERT INTO webinars (title, speaker, speakerEmail, date, time, description, category, difficulty, maxCapacity, imageUrl)
VALUES 
  ('Mastering React', 'John Doe', 'john@example.com', 'March 10, 2026', '2:00 PM - 4:00 PM', 
   'Deep dive into React hooks and best practices', 'Web Development', 'Intermediate', 100, 
   'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=React'),
  ('Cloud Computing Essentials', 'Jane Smith', 'jane@example.com', 'March 15, 2026', '1:00 PM - 3:00 PM',
   'Introduction to AWS, Azure and cloud architecture', 'Cloud', 'Beginner', 150,
   'https://via.placeholder.com/400x250/0EA5E9/FFFFFF?text=Cloud');
```

## Troubleshooting

### Backend Not Starting
- Check if port 5000 is already in use
- Verify MySQL is running: `mysql -u root -p -e "SELECT 1;"`
- Check `.env` credentials: `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### Frontend API Errors
- Ensure backend is running on port 5000
- Check browser console for detailed error messages
- Verify JWT token in browser storage (Dev Tools → Application → Local Storage)

### CORS Issues
- Backend has CORS enabled for all origins
- If issues persist, update server.js CORS config

### Database Connection Failed
- Ensure `edustream` database exists
- Check that `database.sql` was fully imported
- Verify user permissions: `mysql -u root -p edustream -e "SHOW TABLES;"`

### JWT Token Issues
- Token expires after 24 hours - user must log in again
- Token is stored in localStorage under `token` key
- Check terminal logs for token validation errors

## Next Steps

- [ ] Add webinar sample data
- [ ] Test all registration features
- [ ] Implement file uploads (if needed)
- [ ] Add real-time notifications
- [ ] Setup deployment pipeline
- [ ] Implement payment for premium webinars (future)

## File Structure

```
edustream3/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── database.sql
│   ├── package.json
│   ├── .env.example
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── README.md
├── src/
│   ├── services/
│   │   └── api.js (New!)
│   ├── pages/
│   │   ├── Login.jsx (Updated!)
│   │   ├── Signup.jsx (Updated!)
│   │   ├── Dashboard.jsx (Updated!)
│   │   └── ...
│   ├── components/
│   │   ├── Navbar.jsx (Updated!)
│   │   └── ...
│   ├── App.jsx (Updated!)
│   └── ...
├── package.json
└── README.md
```

## API Endpoints Reference

All endpoints require JWT token in Authorization header (except login/signup/public webinars):

```
Authorization: Bearer <your_jwt_token>
```

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login  
- `GET /api/auth/profile` - Get profile (requires token)

### Webinars
- `GET /api/webinars` - Get all webinars
- `GET /api/webinars/:id` - Get webinar details
- `GET /api/webinars/search?search=query` - Search webinars
- `POST /api/webinars` - Create (admin only)
- `PUT /api/webinars/:id` - Update (admin only)
- `DELETE /api/webinars/:id` - Delete (admin only)

### Registrations
- `POST /api/registrations/register` - Register for webinar
- `GET /api/registrations/my-registrations` - Get my registrations
- `DELETE /api/registrations/unregister/:webinarId` - Unregister
- `POST /api/registrations/wishlist` - Add to wishlist
- `DELETE /api/registrations/wishlist/:webinarId` - Remove from wishlist
- `GET /api/registrations/wishlist/my-wishlist` - Get wishlist

And more... See `backend/README.md` for complete API documentation.
