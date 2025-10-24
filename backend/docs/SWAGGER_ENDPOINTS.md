# Swagger API Documentation

This document provides an overview of all Swagger API documentation endpoints available across the microservices.

## 📚 **Available Swagger Documentation**

### **1. User Service** - `http://localhost:3001/api-docs`
- **Authentication endpoints**
- **User management endpoints**
- **Profile management**

### **2. Task Service** - `http://localhost:3002/api-docs`
- **Task CRUD operations**
- **Task assignment and status**
- **Task comments**

### **3. Notification Service** - `http://localhost:3003/api-docs`
- **Notification management**
- **Notification statistics**

### **4. API Gateway** - `http://localhost:3000/api-docs`
- **Centralized API documentation**
- **All service endpoints**

## 🔧 **Setup Instructions**

### **1. Install Dependencies**
```bash
# Install dependencies for all services
npm run install:all
```

### **2. Start All Services**
```bash
# Start all services
npm start

# Or start individually
npm run start:user          # User Service (port 3001)
npm run start:task          # Task Service (port 3002)
npm run start:notification  # Notification Service (port 3003)
npm run start:gateway       # API Gateway (port 3000)
```

### **3. Access Swagger Documentation**
Once services are running, you can access:

- **User Service Swagger**: http://localhost:3001/api-docs
- **Task Service Swagger**: http://localhost:3002/api-docs
- **Notification Service Swagger**: http://localhost:3003/api-docs
- **API Gateway Swagger**: http://localhost:3000/api-docs

## 📋 **API Endpoints Overview**

### **User Service Endpoints**

#### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

#### **User Management**
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user (admin only)
- `PUT /api/users/:id/change-password` - Change user password

### **Task Service Endpoints**

#### **Task Management**
- `GET /api/tasks` - Get tasks with filtering and pagination
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task
- `PATCH /api/tasks/:id/archive` - Archive task

### **Notification Service Endpoints**

#### **Notification Management**
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/:id` - Get notification by ID
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all notifications
- `GET /api/notifications/stats/summary` - Get notification statistics

## 🔐 **Authentication**

All endpoints (except authentication endpoints) require a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 **Testing with Swagger**

### **1. Register a User**
1. Go to User Service Swagger: http://localhost:3001/api-docs
2. Use the `/api/auth/register` endpoint
3. Copy the token from the response

### **2. Test Authenticated Endpoints**
1. Click the "Authorize" button in Swagger UI
2. Enter: `Bearer <your-token>`
3. Now you can test all authenticated endpoints

### **3. Create a Task**
1. Go to Task Service Swagger: http://localhost:3002/api-docs
2. Use the `/api/tasks` POST endpoint
3. Use the user ID from the registration response

## 📊 **Features**

### **Interactive Documentation**
- Try out API endpoints directly in the browser
- See request/response examples
- Test authentication flows

### **Schema Validation**
- Request/response schemas
- Data type validation
- Required field validation

### **Error Handling**
- Detailed error responses
- HTTP status codes
- Error message descriptions

## 🚀 **Quick Start**

1. **Start the services:**
   ```bash
   npm start
   ```

2. **Open Swagger documentation:**
   - User Service: http://localhost:3001/api-docs
   - Task Service: http://localhost:3002/api-docs
   - Notification Service: http://localhost:3003/api-docs
   - API Gateway: http://localhost:3000/api-docs

3. **Test the APIs:**
   - Register a user
   - Login and get token
   - Create tasks
   - View notifications

## 🔧 **Development**

### **Adding New Endpoints**
1. Add Swagger comments to your route handlers
2. Update the schema definitions in `config/swagger.js`
3. Restart the service to see changes

### **Customizing Documentation**
- Modify `config/swagger.js` in each service
- Add custom CSS for styling
- Include additional metadata

## 📝 **Notes**

- All services must be running to access their respective Swagger documentation
- Authentication is required for most endpoints
- The API Gateway provides a centralized view of all services
- Each service has its own independent Swagger documentation

