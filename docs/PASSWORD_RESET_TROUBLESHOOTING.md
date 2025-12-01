# 🔧 Password Reset Troubleshooting

## ❌ Error: 404 Not Found

If you're getting a `404 (Not Found)` error when trying to reset password:

### **Solution: Restart User Service**

The user service needs to be restarted to load the new `/api/auth/reset-password` route.

#### **Option 1: Restart All Backend Services**

```bash
# Stop all backend services
npm run stop:backend

# Start all backend services
npm run start:backend
```

#### **Option 2: Restart User Service Only**

1. **Stop User Service:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```

2. **Start User Service:**
   ```bash
   cd backend/services/user-service
   npm start
   ```

#### **Option 3: Use Restart Script**

```bash
cd backend
.\restart-with-dev-env.ps1
```

---

## ❌ Error: Content Security Policy (CSP) Violation

If you see CSP errors in the console:

### **Solution: CSP is Already Configured**

The CSP is configured to allow `http://localhost:*` connections. If you still see errors:

1. **Clear browser cache**
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check if user service is running** on port 3001

---

## ✅ Verify Route is Working

### **Test the Endpoint Directly:**

```bash
# Using curl
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "provasks@gmail.com"}'

# Or using PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/reset-password" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email": "provasks@gmail.com"}'
```

### **Expected Response:**

```json
{
  "message": "Password reset successfully",
  "newPassword": "Abc123Xyz789",
  "user": {
    "email": "provasks@gmail.com",
    "username": "provasks"
  }
}
```

---

## 🔍 Check Service Status

### **Verify User Service is Running:**

1. **Check if port 3001 is listening:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -State Listen
   ```

2. **Check service health:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Check available routes:**
   - Visit: http://localhost:3001/api-docs
   - Look for `/api/auth/reset-password` endpoint

---

## 🚀 Quick Fix Steps

1. **Stop User Service:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```

2. **Start User Service:**
   ```bash
   cd backend/services/user-service
   npm start
   ```

3. **Wait 5-10 seconds** for service to start

4. **Try password reset again** in the browser

---

## 📝 Route Verification

The route should be available at:
- **Direct:** `http://localhost:3001/api/auth/reset-password`
- **Via Gateway:** `http://localhost:3000/api/auth/reset-password`

Both should work, but the frontend is configured to use the direct service URL.

---

## 🔄 If Still Not Working

1. **Check server logs** for any errors
2. **Verify MongoDB is running**
3. **Check if route is registered:**
   - Open http://localhost:3001/api-docs
   - Look for "Reset Password" endpoint
4. **Clear browser cache and try again**

