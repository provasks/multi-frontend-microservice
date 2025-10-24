# Task Management System - Full Stack Microservices

A comprehensive full-stack microservice-based Task Management System with React frontend and Node.js backend. Features Webpack Module Federation micro-frontend architecture, unified command management, and complete task management functionality.

## 🏗️ Architecture

### **Backend Microservices**
The system consists of four main microservices with proper separation of concerns:

1. **User Service** (Port 3001) - Authentication and user management
   - JWT-based authentication
   - User CRUD operations
   - Role-based access control
   - Database: `tms_users`

2. **Task Service** (Port 3002) - Task CRUD operations
   - Task management with filtering and pagination
   - Task assignment and status tracking
   - Priority levels and due dates
   - Database: `tms_tasks`

3. **Notification Service** (Port 3003) - Task notifications and alerts
   - Real-time notifications
   - Notification management
   - Scheduled notifications
   - Database: `tms_notifications`

4. **API Gateway** (Port 3000) - Request routing and load balancing
   - Centralized API access
   - Request routing to microservices
   - Health checks and monitoring

### **Frontend Architecture**
- **Shell Application** (Port 4000) - Main working application with Webpack Module Federation
  - Micro-frontend orchestration
  - React Router navigation
  - Bootstrap + Font Awesome styling
  - JWT authentication
  - Real-time notifications

- **Micro-Frontends** (Ports 4001-4003) - Independent applications
  - User Management App (Port 4001)
  - Task Management App (Port 4002)
  - Notification App (Port 4003)

## 🗄️ Database Architecture

Each microservice uses its own MongoDB database within a single MongoDB instance:

- **User Service**: `tms_users` (Port 27017)
- **Task Service**: `tms_tasks` (Port 27017)
- **Notification Service**: `tms_notifications` (Port 27017)

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- Git

### 🎯 Unified Commands (Recommended)

**From the root directory, use these simple commands:**

1. **Install everything**:
   ```bash
   npm run install:all
   ```

2. **Start everything** (backend + frontend):
   ```bash
   npm start
   ```

3. **Stop everything**:
   ```bash
   npm run stop:all
   ```

4. **Restart everything**:
   ```bash
   npm run restart
   ```

### 🌐 Access Points

- **Frontend Application**: http://localhost:4000 ✅ **Main Application**
- **API Gateway**: http://localhost:3000 ✅ **Backend API**
- **Swagger Documentation**: 
  - User Service: http://localhost:3001/api/docs
  - Task Service: http://localhost:3002/api/docs
  - Notification Service: http://localhost:3003/api/docs

### 🎯 Key Features

- ✅ **Task Management** - Full CRUD operations with filtering and pagination
- ✅ **User Management** - User administration with role-based access
- ✅ **Notifications** - Real-time notifications with proper filtering
- ✅ **Authentication** - JWT-based authentication system
- ✅ **Responsive Design** - Bootstrap + Font Awesome styling
- ✅ **Micro-Frontend Architecture** - Webpack Module Federation
- ✅ **URL Navigation** - React Router with proper URL changes

### 🔧 Individual Service Commands

```bash
# Backend only
npm run start:backend
npm run stop:backend
npm run restart:backend

# Frontend only  
npm run start:frontend
npm run stop:frontend
npm run restart:frontend

# Install specific parts
npm run install:backend
npm run install:frontend
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/auth/verify` | Verify JWT token |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin only) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |
| DELETE | `/api/users/:id` | Deactivate user (admin only) |
| PUT | `/api/users/:id/change-password` | Change user password |

### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks with filtering and pagination |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/comments` | Add comment to task |
| PATCH | `/api/tasks/:id/archive` | Archive task |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/notifications/:id` | Get notification by ID |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read |
| DELETE | `/api/notifications/:id` | Delete notification |
| DELETE | `/api/notifications` | Delete all notifications |
| GET | `/api/notifications/stats/summary` | Get notification statistics |

## 🔧 Configuration

### Environment Variables

Create `.env` files in each service directory:

#### User Service (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/tms_users
JWT_SECRET=your-jwt-secret-key
```

#### Task Service (.env)
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/tms_tasks
USER_SERVICE_URL=http://localhost:3001
```

#### Notification Service (.env)
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/tms_notifications
TASK_SERVICE_URL=http://localhost:3002
```

#### API Gateway (.env)
```env
PORT=3000
USER_SERVICE_URL=http://localhost:3001
TASK_SERVICE_URL=http://localhost:3002
NOTIFICATION_SERVICE_URL=http://localhost:3003
ALLOWED_ORIGINS=http://localhost:3000
```

## 🔧 Recent Improvements & Fixes

### **Frontend Architecture Enhancements**
- ✅ **Webpack Module Federation** - True micro-frontend architecture implemented
- ✅ **React Router Navigation** - URL-based routing with proper navigation
- ✅ **Header Navigation** - Clean horizontal navigation menu
- ✅ **Error Boundaries** - Graceful error handling for micro-frontends
- ✅ **Bootstrap Table Layout** - Professional table design with proper column widths
- ✅ **Modal Forms** - Clean popup forms for data entry
- ✅ **Responsive Design** - Mobile-first approach with Bootstrap

### **Backend Architecture Refactoring**
- ✅ **Controller/Service Pattern** - Implemented proper separation of concerns
- ✅ **User ID Mapping** - Fixed `req.user.userId` to `req.user._id` across all services
- ✅ **Status Validation** - Fixed status validation mismatch (`in_progress` vs `in-progress`)
- ✅ **Notification Filtering** - Fixed notification filter to handle `read: undefined` states

### **Frontend Enhancements**
- ✅ **UserManagement Component** - Full CRUD operations with API integration
- ✅ **Task Management** - Full CRUD operations with modal forms
- ✅ **Notification System** - Real-time notifications with mark as read functionality
- ✅ **API Integration** - Real backend integration with error handling
- ✅ **Demo Mode Support** - Works without backend API for testing

### **Database & API Fixes**
- ✅ **Task Display** - Fixed empty task list issue with correct user ID mapping
- ✅ **Task Updates** - Fixed 404 errors when updating tasks
- ✅ **Notification Display** - Fixed empty notifications with proper filter logic
- ✅ **Authentication Flow** - JWT token handling working correctly

### **Unified Command Structure**
- ✅ **Single Package.json** - All commands managed from root directory
- ✅ **Process Management** - PowerShell-based service management
- ✅ **Port Management** - Automatic port detection and cleanup

## 🧪 Testing the API

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a task (use token from login response)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the project",
    "priority": "high",
    "assignedTo": "USER_ID",
    "dueDate": "2024-12-31T23:59:59.000Z"
  }'
```

### 4. Get user notifications
```bash
curl -X GET http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐳 Docker Commands

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📊 Monitoring

### Health Checks
- **API Gateway**: `http://localhost:3000/health`
- **User Service**: `http://localhost:3001/health`
- **Task Service**: `http://localhost:3002/health`
- **Notification Service**: `http://localhost:3003/health`

### Service Status
```bash
curl http://localhost:3000/services/status
```

## 📁 Project Structure

```
Task Management System/
├── backend/                          # Backend microservices
│   ├── api-gateway/                  # API Gateway (Port 3000)
│   │   ├── server.js                 # Gateway server
│   │   ├── routes/                   # Gateway routes
│   │   └── package.json
│   ├── services/                     # Microservices
│   │   ├── user-service/             # User Service (Port 3001)
│   │   │   ├── server.js
│   │   │   ├── controllers/          # HTTP request handlers
│   │   │   ├── services/             # Business logic
│   │   │   ├── routes/               # API routes
│   │   │   ├── models/               # Database models
│   │   │   └── middleware/           # Auth middleware
│   │   ├── task-service/             # Task Service (Port 3002)
│   │   │   ├── server.js
│   │   │   ├── controllers/         # HTTP request handlers
│   │   │   ├── services/             # Business logic
│   │   │   ├── routes/               # API routes
│   │   │   ├── models/               # Database models
│   │   │   └── middleware/           # Auth middleware
│   │   └── notification-service/     # Notification Service (Port 3003)
│   │       ├── server.js
│   │       ├── controllers/         # HTTP request handlers
│   │       ├── services/             # Business logic
│   │       ├── routes/               # API routes
│   │       ├── models/               # Database models
│   │       └── middleware/           # Auth middleware
│   ├── docs/                        # API documentation
│   └── docker-compose.yml           # Docker configuration
├── frontend/                        # Frontend application
│   ├── shell-app/                  # Main working application (Port 4000)
│   │   ├── src/
│   │   │   ├── App.jsx              # Main app component with routing
│   │   │   ├── components/          # Shell components
│   │   │   │   ├── AuthenticatedApp.jsx # Micro-frontend orchestrator
│   │   │   │   ├── LoginForm.jsx   # Authentication
│   │   │   │   └── FloatingMessageManager.jsx
│   │   │   └── utils/               # Shared utilities
│   │   ├── webpack.config.js        # Module Federation Host
│   │   └── package.json
│   ├── microfrontends/              # Micro-frontend applications
│   │   ├── user-app/                # User management micro-frontend (Port 4001)
│   │   │   ├── src/
│   │   │   │   ├── UserManagement.jsx # Exposed component
│   │   │   │   ├── utils/           # API utilities
│   │   │   │   └── FloatingMessageManager.jsx
│   │   │   ├── webpack.config.cjs  # Module Federation Remote
│   │   │   └── package.json
│   │   ├── task-app/                # Task management micro-frontend (Port 4002)
│   │   │   ├── src/
│   │   │   │   ├── TaskManagement.jsx # Exposed component
│   │   │   │   ├── utils/           # API utilities
│   │   │   │   └── FloatingMessageManager.jsx
│   │   │   ├── webpack.config.cjs  # Module Federation Remote
│   │   │   └── package.json
│   │   └── notification-app/        # Notification micro-frontend (Port 4003)
│   │       ├── src/
│   │       │   ├── Notifications.jsx # Exposed component
│   │       │   ├── utils/           # API utilities
│   │       │   └── FloatingMessageManager.jsx
│   │       ├── webpack.config.cjs  # Module Federation Remote
│   │       └── package.json
│   └── package.json                 # Frontend package management
├── package.json                     # Root package management
└── README.md                        # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API Gateway
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 📈 Features

### User Management
- User registration and authentication
- Profile management
- Role-based access control
- Password change functionality

### Task Management
- Create, read, update, delete tasks
- Task assignment and status tracking
- Priority levels and due dates
- Task comments and attachments
- Task archiving

### Notifications
- Real-time task notifications
- Overdue task alerts
- Due soon reminders
- Task update notifications
- Comment notifications

### API Gateway
- Request routing and load balancing
- Service discovery
- Health monitoring
- Rate limiting
- Error handling

## ✅ Current Status

### **Fully Functional Features**
- ✅ **Authentication System** - JWT-based login/registration working
- ✅ **Task Management** - Full CRUD operations with filtering and pagination
- ✅ **User Management** - User administration with role-based access
- ✅ **Notification System** - Real-time notifications with proper filtering
- ✅ **API Gateway** - Request routing and load balancing
- ✅ **Database Integration** - All services connected to MongoDB
- ✅ **Frontend Application** - Responsive React app with Bootstrap styling
- ✅ **Micro-Frontend Architecture** - Webpack Module Federation working
- ✅ **URL Navigation** - React Router with proper URL changes

### **Architecture Improvements**
- ✅ **Controller/Service Pattern** - Proper separation of concerns implemented
- ✅ **User ID Mapping** - Fixed across all services (`req.user._id`)
- ✅ **Status Validation** - Consistent status handling (`in_progress`)
- ✅ **Notification Filtering** - Handles all read states correctly
- ✅ **Error Handling** - Robust error handling in all components
- ✅ **Table Layout** - Professional Bootstrap tables with proper column widths
- ✅ **Modal Forms** - Clean popup forms for data entry

### **Unified Management**
- ✅ **Single Command Interface** - All services managed from root
- ✅ **Process Management** - PowerShell-based service control
- ✅ **Port Management** - Automatic port detection and cleanup
- ✅ **Health Monitoring** - Service status checking

## 🛠️ Development

### Running in Development Mode

```bash
# Install dependencies
npm run install:all

# Start individual services
npm run start:user     # User Service
npm run start:task     # Task Service  
npm run start:notification  # Notification Service
npm run start:gateway  # API Gateway
```

### Project Structure
```
task-management-microservices/
├── backend/               # Backend microservices
│   ├── api-gateway/       # API Gateway service (Port 3000)
│   ├── services/          # Microservices
│   │   ├── user-service/      # User management (Port 3001)
│   │   ├── task-service/      # Task management (Port 3002)
│   │   └── notification-service/  # Notifications (Port 3003)
│   ├── docs/              # API documentation
│   ├── docker-compose.yml # Docker configuration
│   └── env.example        # Environment variables example
├── frontend/              # React frontend application
│   ├── shell-app/        # Main working application (Port 4000)
│   ├── microfrontends/    # Micro-frontend apps
│   │   ├── user-app/      # User management micro-frontend (Port 4001)
│   │   ├── task-app/      # Task management micro-frontend (Port 4002)
│   │   └── notification-app/ # Notification micro-frontend (Port 4003)
│   └── package.json       # Frontend package management
├── package.json          # Unified command management
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the health status at `/health`