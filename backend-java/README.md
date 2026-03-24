# EduStream Backend (Spring Boot)

Spring Boot + JPA + MySQL backend for the EduStream webinar management platform.

## Prerequisites

- **Java 17+** installed
- **Maven 3.6+** installed
- **MySQL 8.0+** running
- **Spring Tool Suite (STS)** or IntelliJ IDEA (optional, for IDE development)

## Quick Setup

### Step 1: Create MySQL Database

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE edustream;
EXIT;
```

Import the schema:
```bash
mysql -u root -p edustream < database.sql
```

### Step 2: Configure Application

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edustream
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=your_jwt_secret_key_here_change_in_production
```

### Step 3: Build and Run

**Using Maven:**
```bash
mvn clean install
mvn spring-boot:run
```

**Using STS:**
1. Right-click project → Run As → Spring Boot App
2. Or use Run Configuration with Maven: `spring-boot:run`

**Using IntelliJ:**
1. Right-click `EdustreamBackendApplication.java` → Run

Server runs on `http://localhost:5000/api`

## Project Structure

```
backend-java/
├── src/main/java/com/edustream/
│   ├── controller/          # REST Controllers
│   ├── service/             # Business Logic
│   ├── repository/          # Database Access
│   ├── entity/              # JPA Entities
│   ├── dto/                 # Data Transfer Objects
│   ├── config/              # Configuration Classes
│   ├── security/            # JWT & Security
│   └── EdustreamBackendApplication.java  # Main Class
├── src/main/resources/
│   └── application.properties  # Configuration
├── pom.xml                  # Maven Dependencies
└── database.sql             # Database Schema
```

## API Endpoints

All endpoints require JWT token in Authorization header (except login/signup):

```
Authorization: Bearer <jwt_token>
```

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login (returns JWT token)
- `GET /auth/profile` - Get current user profile

### Webinars
- `GET /webinars` - Get all webinars
- `GET /webinars/{id}` - Get webinar details
- `GET /webinars/search?search=query` - Search webinars (public)
- `POST /webinars` - Create webinar (admin only)
- `PUT /webinars/{id}` - Update webinar (admin only)
- `DELETE /webinars/{id}` - Delete webinar (admin only)

### Registrations
- `POST /registrations/register` - Register for webinar
- `GET /registrations/my-registrations` - Get my registrations
- `DELETE /registrations/unregister/{webinarId}` - Unregister
- `POST /registrations/wishlist` - Add to wishlist
- `DELETE /registrations/wishlist/{webinarId}` - Remove from wishlist
- `GET /registrations/wishlist/my-wishlist` - Get wishlist

### Assignments
- `POST /assignments?webinarId={id}` - Create assignment (admin)
- `GET /assignments/webinar/{webinarId}` - Get assignments for webinar
- `PUT /assignments/{id}` - Update assignment (admin)
- `DELETE /assignments/{id}` - Delete assignment (admin)

### Submissions
- `POST /submissions/submit` - Submit assignment
- `GET /submissions/my-submissions` - Get my submissions
- `GET /submissions/assignment/{assignmentId}` - Get submissions (admin)
- `PUT /submissions/grade/{id}` - Grade submission (admin)

### Reviews
- `POST /reviews` - Add review
- `GET /reviews/webinar/{webinarId}` - Get webinar reviews
- `PUT /reviews/{id}` - Update review (your own)
- `DELETE /reviews/{id}` - Delete review (your own)

## Authentication

### Signup Request
```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

### Login Request
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "message": "Login successful"
}
```

## Configuration Files

### application.properties
```properties
# Server
server.port=5000
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/edustream
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Testing API Endpoints

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get All Webinars:**
```bash
curl http://localhost:5000/api/webinars
```

**Register for Webinar:**
```bash
curl -X POST http://localhost:5000/api/registrations/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"webinarId": 1}'
```

### Using Postman
1. Import the API endpoints
2. Set Authorization → Bearer Token → Add your JWT token
3. Test endpoints

## Security

- **Passwords**: Hashed with BCrypt
- **Tokens**: JWT with 24-hour expiration
- **CORS**: Enabled for specified origins
- **Endpoints**: Protected with role-based access (@PreAuthorize)

## Troubleshooting

### Database Connection Error
```
ERROR: Cannot get a connection, pool error
```
**Solution:**
- Ensure MySQL is running
- Check credentials in `application.properties`
- Verify database exists: `mysql -u root -p -e "USE edustream; SHOW TABLES;"`

### Token Validation Failed
```
Could not set user authentication in security context
```
**Solution:**
- Token may be expired (24 hours)
- Ensure JWT_SECRET is configured correctly
- Check Authorization header format: `Bearer <token>`

### Port Already in Use
```
Address already in use: bind
```
**Solution:**
- Change port in `application.properties`: `server.port=5001`
- Or kill process using port 5000

### Maven Build Fails
```
BUILD FAILURE
```
**Solution:**
```bash
mvn clean install -DskipTests
```

## IDE Setup

### In Spring Tool Suite (STS)
1. File → Open Projects from File System
2. Select `backend-java` folder
3. Right-click project → Maven → Update Project

### In IntelliJ IDEA
1. File → Open → Select `backend-java` folder
2. Choose "Open as Project"
3. Wait for indexing to complete

### Running & Debugging
- **Run**: Right-click class with @SpringBootApplication → Run
- **Debug**: Right-click → Debug As → Spring Boot App
- **Stop**: Ctrl+C in terminal or IDE stop button

## Adding Sample Data

Insert sample webinars into MySQL:

```sql
INSERT INTO webinars (title, speaker, speaker_email, date, time, description, category, difficulty, max_capacity, image_url)
VALUES 
  ('Mastering React', 'John Doe', 'john@example.com', 'March 10, 2026', '2:00 PM - 4:00 PM', 
   'Deep dive into React hooks and best practices', 'Web Development', 'Intermediate', 100, 
   'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=React'),
  ('Cloud Computing Essentials', 'Jane Smith', 'jane@example.com', 'March 15, 2026', '1:00 PM - 3:00 PM',
   'Introduction to AWS, Azure and cloud architecture', 'Cloud', 'Beginner', 150,
   'https://via.placeholder.com/400x250/0EA5E9/FFFFFF?text=Cloud');
```

## Environment Variables

For production, store sensitive data in environment variables:

```bash
export DATASOURCE_USERNAME=produser
export DATASOURCE_PASSWORD=prodpassword
export JWT_SECRET=production_secret_key
```

Update `application.properties`:
```properties
spring.datasource.username=${DATASOURCE_USERNAME}
spring.datasource.password=${DATASOURCE_PASSWORD}
jwt.secret=${JWT_SECRET}
```

## Dependencies Used

- **Spring Boot 3.1.5** - Framework
- **Spring Data JPA** - ORM
- **MySQL Connector** - Database
- **JWT (JJWT)** - Authentication
- **Spring Security** - Security
- **Lombok** - Boilerplate reduction
- **Spring Web** - REST APIs

## Building for Production

```bash
mvn clean package -DskipTests
java -jar target/edustream-backend-1.0.0.jar
```

## Health Check

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status": "UP"}
```

## Support & Debug

Enable debug logging in `application.properties`:
```properties
logging.level.com.edustream=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

Then check output in console or `logs/spring.log`

## Next Steps

- [ ] Add email notifications
- [ ] Implement file uploads for assignments
- [ ] Add payment integration
- [ ] Setup CI/CD pipeline
- [ ] Add API documentation (Swagger/SpringDoc)
- [ ] Implement caching (Redis)
- [ ] Add audit logging
- [ ] Setup monitoring (Actuator)

## License

MIT
