# Health Check API

A cloud-native backend application implementing a health check endpoint using Node.js, Express, Sequelize, and PostgreSQL.

## Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (v18 or higher) and npm
2. **PostgreSQL** database server (v14 or higher)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <https://github.com/Gnana-Shishir-Kumar/AWS_webapp.git>
cd <AWS_webapp>
```

### 2. Create a Database

Before starting the application, create a database in your PostgreSQL server:

```sql
CREATE DATABASE healthcheck_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE healthcheck_db TO your_username;
GRANT CREATE ON SCHEMA public TO your_username;
GRANT USAGE ON SCHEMA public TO your_username;
```

### 3. Create a `.env` File

In the root of the project folder, create a `.env` file and add the following environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcheck_db
DB_USER=your_username
DB_PASSWORD=your_password
PORT=8080
NODE_ENV=development
```

### 4. Install Dependencies

Install the required Node.js packages by running:

```bash
npm install
```

### 5. Run the Application

You can run the application using either of the following commands:

**Using npm start:**
```bash
npm start
```

**Using npm development mode (with auto-restart):**
```bash
npm run dev
```

The application will start on port `8080` or the port specified in the `.env` file. The API will be accessible at:

```
http://localhost:8080/healthz
```

## Testing the API

### Using Postman

1. Open Postman and create a new request.
2. Use the following details:
   - **Method**: `GET`
   - **URL**: `http://localhost:8080/healthz`

### Test Scenarios

| Scenario | Expected Status Code | Notes |
|----------|---------------------|-------|
| Valid `GET` request without body | `200 OK` | Health check successful |
| `GET` request with query parameters | `400 Bad Request` | Query parameters not allowed |
| `GET` request with JSON body | `400 Bad Request` | Request body not allowed |
| Invalid JSON `{"name":}` | `400 Bad Request` | Malformed JSON request |
| Unsupported HTTP method (e.g., `PUT`) | `405 Method Not Allowed` | Only `GET` is supported |
| Database unavailable | `503 Service Unavailable` | Database connectivity issue |

### Using Curl

Here are the `curl` commands for testing the API:

**1. Valid `GET` Request (No Payload)**
```bash
curl -vvvv http://localhost:8080/healthz
```
**Expected**: `200 OK`

**2. `GET` Request with Query Parameters**
```bash
curl -vvvv "http://localhost:8080/healthz?test=value"
```
**Expected**: `400 Bad Request`

**3. `GET` Request with JSON Body**
```bash
curl -vvvv -X GET -d '{"key":"value"}' -H "Content-Type: application/json" http://localhost:8080/healthz
```
**Expected**: `400 Bad Request`

**4. Unsupported HTTP Methods**
```bash
curl -vvvv -X POST http://localhost:8080/healthz
curl -vvvv -X PUT http://localhost:8080/healthz
curl -vvvv -X PATCH http://localhost:8080/healthz
curl -vvvv -X DELETE http://localhost:8080/healthz
```
**Expected**: `405 Method Not Allowed`

**5. Database Unavailable**

Stop PostgreSQL service:
```bash
# Linux/macOS
sudo systemctl stop postgresql

# Windows
net stop postgresql-x64-17
```

Then test:
```bash
curl -vvvv http://localhost:8080/healthz
```
**Expected**: `503 Service Unavailable`

**6. Invalid URL**
```bash
curl -vvvv http://localhost:8080/invalid
```
**Expected**: `404 Not Found`

## Verifying Data in PostgreSQL

After successfully hitting the API with a `200 OK` response, you can verify the database records using the following PostgreSQL commands:

1. **Connect to the database:**
```bash
psql -h localhost -U your_username -d healthcheck_db
```

2. **View the table structure:**
```sql
\d health_checks
```

3. **Retrieve all records from the `health_checks` table:**
```sql
SELECT * FROM health_checks ORDER BY check_datetime DESC LIMIT 10;
```

4. **Exit PostgreSQL:**
```sql
\q
```

## Project Details

### Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL (v14+)
- **Environment Management**: dotenv

### Database Schema

The application automatically creates a `health_checks` table with:
- `check_id` (BIGSERIAL, Primary Key)
- `check_datetime` (TIMESTAMP WITH TIME ZONE, UTC)

### Project Structure

```
project/
├── config/
│   └── database.js          # Database configuration
├── models/
│   └── HealthCheck.js       # Sequelize model
├── routes/
│   └── health.js           # Health check endpoint
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Dependencies and scripts
├── server.js              # Main application entry point
└── README.md              # This file
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/healthz` | GET | Performs a health check and inserts a record |

### Response Headers

All responses include:
- `Cache-Control: no-cache, no-store, must-revalidate`
- `Pragma: no-cache`
- `X-Content-Type-Options: nosniff`

### Features

- **Automatic Database Setup**: Creates tables using Sequelize migrations
- **Cloud-Native Design**: Stateless, externalized configuration
- **Health Monitoring**: Database connectivity verification
- **Error Handling**: Graceful handling of all error scenarios
- **UTC Timestamps**: All timestamps stored in UTC timezone
- **Input Validation**: Proper validation of HTTP methods and request data
- **RESTful Compliance**: Proper HTTP status codes and headers

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | healthcheck_db | Database name |
| DB_USER | postgres | PostgreSQL username |
| DB_PASSWORD | | PostgreSQL password |
| PORT | 8080 | Application port |
| NODE_ENV | development | Environment mode |

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials in `.env`
   - Ensure user has proper permissions

2. **Permission Denied for Schema Public:**
   - Grant proper permissions to your user:
   ```sql
   GRANT CREATE ON SCHEMA public TO your_username;
   GRANT USAGE ON SCHEMA public TO your_username;
   ```

3. **Port Already in Use:**
   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:8080 | xargs kill`
