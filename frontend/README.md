# Task Management System - Frontend

A modern React application with Webpack Module Federation micro-frontend architecture. Features a shell application that orchestrates independent micro-frontends for true micro-frontend separation.

## 🏗️ Architecture

### **Shell Application (Host)**
- **Port**: 4000
- **Technology**: React + Webpack Module Federation + Bootstrap
- **Status**: ✅ **Fully Functional**
- **Role**: Orchestrates micro-frontends and provides navigation

### **Micro-Frontends (Remotes)**
- **Status**: ✅ **Independent Applications**
- **Purpose**: True micro-frontend architecture with independent deployment

1. **User App** (Port 4001) - User management micro-frontend
2. **Task App** (Port 4002) - Task management micro-frontend  
3. **Notification App** (Port 4003) - Notification micro-frontend

### **Webpack Module Federation Benefits**
- ✅ **Independent Development** - Each team can work on their micro-frontend
- ✅ **Independent Deployment** - Deploy micro-frontends separately
- ✅ **Shared Dependencies** - Common libraries are shared efficiently
- ✅ **Hot Reloading** - Full hot reloading support during development

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Backend services running (see main README)

### 🎯 Installation

**From the frontend directory:**

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

### 🎯 Development Commands

**Start all micro-frontends:**
```bash
npm run start:all
```

**Start individual services:**
```bash
# Shell app (host)
npm run start:shell

# Individual micro-frontends
npm run start:user
npm run start:task
npm run start:notification
```

**Stop all services:**
```bash
npm run stop:all
```

### 🌐 Access Points

- **Shell Application**: http://localhost:4000 ✅ **Main Application**
- **User App**: http://localhost:4001 ✅ **Standalone**
- **Task App**: http://localhost:4002 ✅ **Standalone**
- **Notification App**: http://localhost:4003 ✅ **Standalone**

## 📁 Project Structure

```
frontend/
├── shell-app/                      # ✅ HOST APPLICATION
│   ├── src/
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── components/             # Shell components
│   │   │   ├── AuthenticatedApp.jsx # Micro-frontend orchestrator
│   │   │   ├── LoginForm.jsx       # Authentication
│   │   │   └── FloatingMessageManager.jsx
│   │   └── utils/                  # Shared utilities
│   ├── webpack.config.js           # Module Federation Host
│   └── package.json
├── microfrontends/                 # ✅ REMOTE APPLICATIONS
│   ├── user-app/                   # User management micro-frontend
│   │   ├── src/
│   │   │   ├── UserManagement.jsx  # Exposed component
│   │   │   ├── utils/              # API utilities
│   │   │   └── FloatingMessageManager.jsx
│   │   ├── webpack.config.cjs      # Module Federation Remote
│   │   └── package.json
│   ├── task-app/                   # Task management micro-frontend
│   │   ├── src/
│   │   │   ├── TaskManagement.jsx  # Exposed component
│   │   │   ├── utils/              # API utilities
│   │   │   └── FloatingMessageManager.jsx
│   │   ├── webpack.config.cjs      # Module Federation Remote
│   │   └── package.json
│   └── notification-app/           # Notification micro-frontend
│       ├── src/
│       │   ├── Notifications.jsx  # Exposed component
│       │   ├── utils/              # API utilities
│       │   └── FloatingMessageManager.jsx
│       ├── webpack.config.cjs     # Module Federation Remote
│       └── package.json
├── package.json                    # Frontend package management
└── README.md
```

## 🛠️ Development

### 🎯 Micro-Frontend Development

Each micro-frontend can be developed independently:

1. **Standalone Development**: Each app can run independently
2. **Shared Dependencies**: React and common libraries are shared
3. **Independent Deployment**: Each micro-frontend can be deployed separately
4. **Hot Reloading**: Full hot reloading support during development

### 🔧 Development Commands

```bash
# Start all micro-frontends
npm run start:all

# Start individual services
npm run start:shell
npm run start:user
npm run start:task
npm run start:notification

# Build for production
npm run build:all

# Stop services
npm run stop:all
```

### 🔧 Shell App Integration

The shell app uses `React.lazy()` to dynamically load micro-frontends:

```javascript
// Lazy load micro-frontends with error handling
const UserManagement = React.lazy(() => import('userApp/UserManagement').catch(() => ({ default: () => <div className="alert alert-danger">Failed to load User Management</div> })));
const TaskManagement = React.lazy(() => import('taskApp/TaskManagement').catch(() => ({ default: () => <div className="alert alert-danger">Failed to load Task Management</div> })));
const Notifications = React.lazy(() => import('notificationApp/Notifications').catch(() => ({ default: () => <div className="alert alert-danger">Failed to load Notifications</div> })));
```

## 🎨 Technologies Used

### **Core Technologies**
- **React 18.2.0** - UI library
- **Webpack 5** - Build tool and Module Federation
- **Babel** - JavaScript transpilation

### **UI Libraries**
- **Bootstrap 5** - Primary CSS framework
- **Font Awesome** - Icons

### **Module Federation**
- **webpack-plugin-federation** - Module Federation plugin
- **Shared Dependencies** - React, React-DOM, React Router

## 🔧 Configuration

### **Webpack Module Federation Configuration**

**Host Configuration (Shell App):**
```javascript
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    userApp: 'userApp@http://localhost:4001/remoteEntry.js',
    taskApp: 'taskApp@http://localhost:4002/remoteEntry.js',
    notificationApp: 'notificationApp@http://localhost:4003/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, eager: false },
    'react-dom': { singleton: true, eager: false },
    'react-router-dom': { singleton: true, eager: false },
  },
})
```

**Remote Configuration (Micro-Frontends):**
```javascript
new ModuleFederationPlugin({
  name: 'userApp', // or 'taskApp', 'notificationApp'
  filename: 'remoteEntry.js',
  exposes: {
    './UserManagement': './src/UserManagement',
  },
  shared: {
    react: { singleton: true, eager: false },
    'react-dom': { singleton: true, eager: false },
  },
})
```

## 📱 Features

### **🔐 Authentication & Navigation**
- **JWT Token-based Authentication** - Secure login/logout
- **React Router Navigation** - URL-based routing with proper navigation
- **Header Navigation** - Clean horizontal navigation menu
- **Active Tab Highlighting** - Visual feedback for current page
- **Responsive Design** - Mobile-first approach with Bootstrap

### **👥 User Management**
- **User Registration** - Create new users with validation
- **User Profile Management** - Edit user information
- **User Listing** - View all users with pagination
- **Role Management** - Admin and user roles
- **Status Management** - Active/inactive user status
- **Bootstrap Table Display** - Professional table layout

### **📋 Task Management**
- **Full CRUD Operations** - Create, read, update, delete tasks
- **Task Assignment** - Assign tasks to users
- **Priority Levels** - Low, medium, high, urgent priorities
- **Status Tracking** - Pending, in progress, completed, cancelled
- **Due Date Management** - Set and track task deadlines
- **Bootstrap Modal Forms** - Add/edit tasks in popup modals
- **Bootstrap Table Display** - Professional table with proper column widths
- **API Integration** - Real backend integration with error handling

### **🔔 Notifications**
- **Real-time Notification Display** - View all notifications
- **Mark as Read/Unread** - Toggle notification status
- **Notification Management** - Create, edit, delete notifications
- **Notification Types** - Info, success, warning, error types
- **Bootstrap Table Display** - Professional table layout
- **Demo Mode Support** - Works without backend API

### **🎨 UI/UX Features**
- **Bootstrap 5 Design** - Modern, responsive interface
- **Font Awesome Icons** - Professional iconography
- **Responsive Tables** - Mobile-friendly table layouts
- **Modal Forms** - Clean popup forms for data entry
- **Error Boundaries** - Graceful error handling
- **Loading States** - User feedback during operations
- **Tooltips** - Helpful hover information
- **Clean Navigation** - Intuitive header navigation

## 🚀 Deployment

### **Development**
```bash
npm run start:all
```

### **Production Build**
```bash
npm run build:all
```

### **Independent Deployment**

Each micro-frontend can be deployed independently:

```bash
# Deploy shell app
cd shell-app && npm run build

# Deploy user app
cd microfrontends/user-app && npm run build

# Deploy task app
cd microfrontends/task-app && npm run build

# Deploy notification app
cd microfrontends/notification-app && npm run build
```

## 🔗 Integration with Backend

The frontend integrates with the backend microservices:

- **User Service** (Port 3001): Authentication and user management
- **Task Service** (Port 3002): Task CRUD operations
- **Notification Service** (Port 3003): Real-time notifications
- **API Gateway** (Port 3000): Centralized API access

### **API Endpoints Used**
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **Users**: `GET /api/users`, `PUT /api/users/:id`
- **Tasks**: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`
- **Notifications**: `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `DELETE /api/notifications/:id`

## 🧪 Testing

### **Manual Testing**
1. Start all services: `npm run start:all`
2. Access shell app: http://localhost:4000
3. Test user registration/login
4. Create and manage tasks
5. Check notifications
6. Test navigation between pages
7. Test responsive design

### **Standalone Testing**
Each micro-frontend can be tested independently:
- User App: http://localhost:4001
- Task App: http://localhost:4002
- Notification App: http://localhost:4003

### **API Testing**
- Use the backend Swagger documentation
- Test API endpoints directly
- Verify authentication flow

## 📝 Benefits of Webpack Module Federation

### **True Micro-Frontend Architecture**
- ✅ **Independent Development** - Each team can work on their micro-frontend
- ✅ **Independent Deployment** - Deploy micro-frontends separately
- ✅ **Technology Flexibility** - Each micro-frontend can use different technologies
- ✅ **Shared Dependencies** - Common libraries are shared efficiently

### **Development Benefits**
- ✅ **Hot Reloading** - Full hot reloading support
- ✅ **Standalone Development** - Each app can run independently
- ✅ **Shared State** - Global state management across micro-frontends
- ✅ **Error Boundaries** - Graceful error handling for micro-frontends

## 🆘 Troubleshooting

### **Common Issues**

1. **Module Federation Errors**: Ensure all micro-frontends are running
2. **Port Conflicts**: Ensure ports 4000-4003 are available
3. **CORS Errors**: Check backend CORS configuration
4. **Shared Dependencies**: Ensure consistent React versions
5. **Routing Issues**: Check React Router configuration

### **Debug Mode**

Enable debug mode by setting `NODE_ENV=development` in your environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.