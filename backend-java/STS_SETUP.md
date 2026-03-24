# Opening EduStream Spring Boot Backend in STS

## Prerequisites

- Spring Tool Suite 4.x installed
- Java 17+ installed
- Maven 3.6+ installed

## How to Open in STS

### Method 1: Import Existing Maven Project

1. **Open STS** and go to File menu
2. Click **File → Open Projects from File System...**
3. Click **Directory...** button
4. Navigate to: `c:\Users\hp\OneDrive\Desktop\edustream3\backend-java`
5. Click **Open**
6. STS will detect it as a Maven project
7. Click **Finish**

STS will automatically:
- Recognize the `pom.xml`
- Download dependencies from Maven Central
- Build the project

### Method 2: Using Command Line

```bash
cd c:\Users\hp\OneDrive\Desktop\edustream3\backend-java
mvn clean install
```

Then in STS:
- File → Open Projects from File System
- Navigate to backend-java folder
- Click Finish

## First Time Setup in STS

After opening the project:

1. **Update Maven Project** (if needed):
   - Right-click project → Maven → Update Project
   - Or press Alt+F5

2. **Configure MySQL Connection**:
   - Edit `src/main/resources/application.properties`
   - Update database credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/edustream
     spring.datasource.username=root
     spring.datasource.password=your_password
     ```

3. **Create Database**:
   ```bash
   mysql -u root -p
   CREATE DATABASE edustream;
   EXIT;
   mysql -u root -p edustream < database.sql
   ```

## Running the Server in STS

### Method 1: Run as Spring Boot App

1. Right-click `EdustreamBackendApplication.java` (in src/main/java/com/edustream/)
2. Click **Run As → Spring Boot App**

The server will start on: `http://localhost:5000/api`

### Method 2: Run as Maven Application

1. Right-click project
2. Click **Run As → Maven build...**
3. In "Goals" field, enter: `spring-boot:run`
4. Click **Run**

### Method 3: Debug Mode

1. Right-click `EdustreamBackendApplication.java`
2. Click **Debug As → Spring Boot App**
3. Set breakpoints by clicking on line numbers
4. Server will pause at breakpoints for debugging

## Verifying Server is Running

Open browser or terminal:

```bash
curl http://localhost:5000/api/webinars
```

Should return JSON array (may be empty if no webinars added).

## IDE Features in STS

### Spring Boot Dashboard
- Window → Show View → Spring Boot Dashboard
- Shows running Spring Boot apps
- Click to stop/restart

### Maven Dependencies
- Right-click project → Maven → Open Effective POM
- Or view in pom.xml file

### Code Generation
- Right-click package → New → Spring Beans Config File
- Or Spring Component, etc.

## Troubleshooting in STS

### Project Shows Red X (Build Error)

1. Right-click project → Maven → Update Project (Alt+F5)
2. Clean project: Project → Clean → Select this project → Clean
3. Force update dependencies:
   ```bash
   cd backend-java
   mvn clean install -U
   ```

### Can't Find Main Class

Ensure `EdustreamBackendApplication.java` exists at:
```
src/main/java/com/edustream/EdustreamBackendApplication.java
```

### Port 5000 Already in Use

Edit `application.properties`:
```properties
server.port=5001
```

### Dependencies Not Downloading

1. Check internet connection
2. Update Maven settings:
   - Window → Preferences → Maven → User Settings
   - Click "Update Settings"
3. Clean cache: `mvn clean install -U`

## File Structure in STS

```
backend-java/
├── src/
│   ├── main/
│   │   ├── java/com/edustream/
│   │   │   ├── controller/      ← REST Controllers
│   │   │   ├── service/         ← Business Logic
│   │   │   ├── entity/          ← JPA Entities
│   │   │   ├── repository/      ← Data Access
│   │   │   ├── dto/             ← Data Objects
│   │   │   ├── config/          ← Configuration
│   │   │   ├── security/        ← JWT/Security
│   │   │   └── EdustreamBackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── target/                      ← Compiled code
├── pom.xml                      ← Maven config
└── database.sql                 ← DB schema
```

## Useful STS Keyboard Shortcuts

- `Ctrl+Shift+O` - Organize Imports
- `Ctrl+F` - Find in file
- `Ctrl+H` - Find & Replace
- `Alt+/` - Content Assist (autocomplete)
- `Ctrl+Shift+F` - Format Code
- `F11` - Debug
- `Ctrl+F11` - Run

## Connecting Frontend to Backend

Update frontend API URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Then run both:
- Backend: Running in STS
- Frontend: `npm run dev` in root directory

## Testing API Endpoints in STS

Use the REST Client extension or install it:

1. Window → Preferences → search "rest"
2. Install REST Client plugin if available
3. Create `.http` file and make requests

Or use Postman:
1. Download Postman
2. import API collection
3. Set Authorization header with JWT token

## Production Build

In STS Terminal:

```bash
mvn clean package -DskipTests
```

Creates JAR file: `target/edustream-backend-1.0.0.jar`

Run:
```bash
java -jar target/edustream-backend-1.0.0.jar
```

## Next Steps

1. ✅ Open project in STS
2. ✅ Verify dependencies download
3. ✅ Configure application.properties
4. ✅ Create MySQL database
5. ✅ Run server
6. ✅ Test API endpoints
7. Connect frontend to backend
8. Add sample data
9. Start development!

## Support

For issues:
1. Check STS Console view (Window → Show View → Console)
2. Check Error Log (Window → Show View → Error Log)
3. Check application logs: `target/logs/`

---

Happy coding! 🚀
