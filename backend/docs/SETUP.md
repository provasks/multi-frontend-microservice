# Setup Guide - Task Management System

This guide will help you set up and run the microservice-based Task Management System with enhanced security, centralized configuration, and comprehensive monitoring.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v7.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### Optional (Recommended)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Postman** or **Insomnia** - For API testing

## Project Structure

```
task-management-microservices/
├── backend/
│   ├── api-gateway/              # API Gateway service (port 3000)
│   ├── services/                 # Microservices folder
│   │   ├── user-service/        # User management service (port 3001)
│   │   ├── task-service/        # Task management service (port 3002)
│   │   └── notification-service/ # Notification service (port 3003)
│   ├── shared/                   # Shared backend components
│   │   ├── middleware/          # Security, error handling, monitoring
│   │   ├── utils/              # Utilities and helpers
│   │   ├── config/             # Centralized configuration
│   │   └── constants/          # Shared constants
│   ├── docs/                    # Backend documentation
│   ├── docker-compose.yml      # Docker configuration
│   └── env.example            # Environment variables example
├── frontend/
│   ├── shell-app/              # Main shell application (port 4000)
│   ├── microfrontends/         # Individual microfrontends
│   │   ├── user-app/          # User management app (port 4001)
│   │   ├── task-app/          # Task management app (port 4002)
│   │   └── notification-app/  # Notification app (port 4003)
│   ├── shared-components/      # Shared frontend components (port 4004)
│   └── docs/                   # Frontend documentation
├── package.json               # Root package.json
└── README.md                 # Main documentation
```

## Setup Options

### Option 1: Docker Setup (Recommended for Beginners)

This is the easiest way to get started as Docker handles all the database setup and service orchestration.

#### Step 1: Clone the Repository
```bash
git clone https://github.com/provasks/multi-frontend-microservice.git
cd multi-frontend-microservice
```

#### Step 2: Start with Docker Compose
```bash
# Navigate to backend directory
cd backend

# Start all services and databases
docker-compose up -d

# Check if all services are running
docker-compose ps
```

#### Step 3: Verify Setup
```bash
# Check API Gateway health
curl http://localhost:3000/health

# Check all services status
curl http://localhost:3000/services/status
```

### Option 2: Manual Setup (For Development)

#### Step 1: Install Backend Dependencies
```bash
# Navigate to backend directory
cd backend

# Install dependencies for all services
npm run install:all
```

#### Step 2: Setup MongoDB
Ensure MongoDB is running on localhost:27017

#### Step 3: Start Backend Services
```bash
# Start all backend services at once
npm start

# Or start individually
npm run start:user          # User Service (port 3001)
npm run start:task          # Task Service (port 3002)  
npm run start:notification  # Notification Service (port 3003)
npm run start:gateway       # API Gateway (port 3000)
```

#### Step 4: Setup Frontend (Microfrontends)
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies for all frontend services
npm install

# Start shared components first (required for other apps)
cd shared-components
npm install
npm start  # Runs on port 4004

# In separate terminals, start other frontend services:
cd ../shell-app
npm install
npm start  # Main app on port 4000

cd ../microfrontends/user-app
npm install
npm start  # User app on port 4001

cd ../microfrontends/task-app
npm install
npm start  # Task app on port 4002

cd ../microfrontends/notification-app
npm install
npm start  # Notification app on port 4003
```

## Available Scripts

### Start Services
```bash
npm start                    # Start all services
npm run start:gateway        # Start API Gateway only
npm run start:user          # Start User Service only
npm run start:task          # Start Task Service only
npm run start:notification  # Start Notification Service only
```

### Stop Services
```bash
npm run stop                # Stop all Node.js processes
npm run stop:ports          # Stop processes on ports 3000-3003
npm run stop:all           # Stop everything
npm run restart            # Restart all services
```

### Development
```bash
npm run install:all         # Install dependencies for all services
npm run dev                 # Start in development mode
```

## Testing the Setup

### 1. Health Check
```bash
# Check API Gateway
curl http://localhost:3000/health

# Check individual services
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # Task Service
curl http://localhost:3003/health  # Notification Service
```

### 2. Register a Test User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Development Configuration

### Rate Limiting
The system includes intelligent rate limiting that adapts to the environment:

- **Development**: Rate limiting is disabled or very lenient for localhost
- **Production**: Strict rate limiting (100 requests per 15 minutes)

If you encounter "Too many requests" errors in development:
```bash
# Restart all backend services to apply rate limiting changes
cd backend
node restart-all-services.js
```

### Environment Variables
Create a `.env` file in the backend directory:
```bash
# Copy the example file
cp env.example .env

# Edit with your configuration
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tms
JWT_SECRET=your-secret-key
```

### Security Features
- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Sanitization**: XSS protection
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: DoS protection
- **Security Logging**: Comprehensive audit trails

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Stop all services
npm run stop:all

# Or kill specific processes
taskkill /F /IM node.exe
```

#### 2. MongoDB Connection Issues
- Ensure MongoDB is running on localhost:27017
- Check if the data directories exist
- Verify MongoDB logs for errors

#### 3. Service Communication Issues
- Check if all services are running
- Verify environment variables
- Check service health endpoints

#### 4. Rate Limiting Issues
- Restart backend services to clear rate limit data
- Check if NODE_ENV is set to 'development'
- Verify localhost IP detection

#### 5. Frontend Module Federation Issues
- Ensure shared-components is running on port 4004
- Check webpack module federation configuration
- Restart frontend services in correct order

## Support

For support and questions:
- Check the API documentation at `/api/docs`
- Review the health status at `/health`
- Create an issue in the repository

