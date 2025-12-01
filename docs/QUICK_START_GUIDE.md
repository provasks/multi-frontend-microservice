# 🚀 Quick Start Guide

## ⚠️ Common Error: Connection Refused

If you see errors like:
```
GET http://localhost:4001/remoteEntry.js net::ERR_CONNECTION_REFUSED
GET http://localhost:4002/remoteEntry.js net::ERR_CONNECTION_REFUSED
GET http://localhost:4003/remoteEntry.js net::ERR_CONNECTION_REFUSED
GET http://localhost:4004/remoteEntry.js net::ERR_CONNECTION_REFUSED
```

**This means the microfrontends are not running!** You need to start all frontend services.

---

## 🎯 Starting All Services

### **Option 1: Start All Frontend Services (Recommended)**

From the `frontend` directory:

```bash
cd frontend
npm run start:all
```

This starts:
- ✅ Shell App (Port 4000)
- ✅ User App (Port 4001)
- ✅ Task App (Port 4002)
- ✅ Notification App (Port 4003)
- ✅ Shared Components (Port 4004)

### **Option 2: Start Individual Services**

If you prefer to start services individually (in separate terminals):

```bash
# Terminal 1 - Shared Components (start this first!)
cd frontend/shared-components
npm start  # Port 4004

# Terminal 2 - Shell App
cd frontend/shell-app
npm start  # Port 4000

# Terminal 3 - User App
cd frontend/microfrontends/user-app
npm start  # Port 4001

# Terminal 4 - Task App
cd frontend/microfrontends/task-app
npm start  # Port 4002

# Terminal 5 - Notification App
cd frontend/microfrontends/notification-app
npm start  # Port 4003
```

### **Option 3: Start Everything (Backend + Frontend)**

From the root directory:

```bash
# Start backend services
npm run start:backend

# In another terminal, start all frontend services
cd frontend
npm run start:all
```

Or use the root script (but it only starts shell app):

```bash
npm run start:frontend:all  # Only starts shell app, not all microfrontends!
```

---

## 📋 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Shell App | 4000 | http://localhost:4000 |
| User App | 4001 | http://localhost:4001 |
| Task App | 4002 | http://localhost:4002 |
| Notification App | 4003 | http://localhost:4003 |
| Shared Components | 4004 | http://localhost:4004 |

---

## ✅ Verification

After starting all services, verify they're running:

1. **Check Shell App**: http://localhost:4000
2. **Check User App**: http://localhost:4001
3. **Check Task App**: http://localhost:4002
4. **Check Notification App**: http://localhost:4003
5. **Check Shared Components**: http://localhost:4004/remoteEntry.js

All should load without errors.

---

## 🛑 Stopping Services

### **Stop All Frontend Services:**

```bash
cd frontend
npm run stop:all
```

### **Stop All Services (Backend + Frontend):**

From root directory:

```bash
npm run stop:all
```

---

## 🔧 Troubleshooting

### **Port Already in Use**

If you get "port already in use" errors:

```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 4000,4001,4002,4003,4004 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Or use the stop script
cd frontend
npm run stop:all
```

### **Module Federation Errors**

If you see Module Federation errors:

1. **Make sure Shared Components is running first** (Port 4004)
2. **Then start other microfrontends**
3. **Finally start Shell App** (Port 4000)

The order matters because:
- Shell App depends on all microfrontends
- Microfrontends depend on Shared Components

### **Dependencies Not Installed**

If services fail to start:

```bash
# Install all dependencies
cd frontend
npm run install:all
```

---

## 📝 Development Workflow

### **Recommended Development Setup:**

1. **Terminal 1**: Backend services
   ```bash
   npm run start:backend
   ```

2. **Terminal 2**: All frontend services
   ```bash
   cd frontend
   npm run start:all
   ```

3. **Access**: http://localhost:4000 (Shell App)

### **Hot Reloading:**

All services support hot reloading. When you make changes:
- ✅ Changes in microfrontends will hot reload
- ✅ Changes in shell app will hot reload
- ✅ Changes in shared components will hot reload

---

## 🎯 Quick Commands Reference

```bash
# From root directory
npm start                    # Start backend + shell app only
npm run start:backend        # Start all backend services
npm run start:frontend:all   # Start shell app only (not all microfrontends!)

# From frontend directory
npm run start:all            # Start ALL frontend services ✅
npm run start:shell          # Start shell app only
npm run start:user           # Start user app only
npm run start:task           # Start task app only
npm run start:notification   # Start notification app only
npm run start:shared         # Start shared components only
npm run stop:all             # Stop all frontend services
```

---

## 💡 Pro Tip

**Always start Shared Components first**, then other microfrontends, then Shell App. Or just use `npm run start:all` from the frontend directory - it handles the order automatically!

---

## 📚 Related Documentation

- [Frontend Documentation](./frontend/README.md)
- [Setup Guide](./backend/docs/SETUP.md)
- [Architecture Diagram](./docs/ARCHITECTURE_DIAGRAM.md)

