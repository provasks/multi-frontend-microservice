# Setup Guide - Task Management System

This guide will help you set up and run the microservice-based Task Management System.

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
├── api-gateway/              # API Gateway service
├── services/                 # Microservices folder
│   ├── user-service/        # User management service
│   ├── task-service/        # Task management service
│   └── notification-service/ # Notification service
├── docs/                    # Documentation
│   └── SETUP.md            # This file
├── docker-compose.yml      # Docker configuration
├── env.example            # Environment variables example
├── package.json           # Root package.json
└── README.md             # Main documentation
```

## Setup Options

### Option 1: Docker Setup (Recommended for Beginners)

This is the easiest way to get started as Docker handles all the database setup and service orchestration.

#### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd task-management-microservices
```

#### Step 2: Start with Docker Compose
```bash
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

#### Step 1: Install Dependencies
```bash
# Install dependencies for all services
npm run install:all
```

#### Step 2: Setup MongoDB
Ensure MongoDB is running on localhost:27017

#### Step 3: Start All Services
```bash
# Start all services at once
npm start

# Or start individually
npm run start:user          # User Service (port 3001)
npm run start:task          # Task Service (port 3002)  
npm run start:notification  # Notification Service (port 3003)
npm run start:gateway       # API Gateway (port 3000)
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

## Support

For support and questions:
- Check the API documentation at `/api/docs`
- Review the health status at `/health`
- Create an issue in the repository

