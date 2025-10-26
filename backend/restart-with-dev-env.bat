@echo off
echo 🔄 Restarting Backend Services with NODE_ENV=development

REM Set environment variable
set NODE_ENV=development
echo ✅ NODE_ENV set to: %NODE_ENV%

echo 🛑 Stopping existing services...

REM Kill processes on ports 3000-3003
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003"') do taskkill /F /PID %%a 2>nul

echo Waiting for processes to stop...
timeout /t 3 /nobreak >nul

echo 🚀 Starting services with NODE_ENV=development...

REM Start API Gateway
echo Starting API Gateway (Port 3000)...
start "API Gateway" cmd /k "cd /d "%~dp0api-gateway" && set NODE_ENV=development && npm start"

REM Start User Service
echo Starting User Service (Port 3001)...
start "User Service" cmd /k "cd /d "%~dp0services\user-service" && set NODE_ENV=development && npm start"

REM Start Task Service
echo Starting Task Service (Port 3002)...
start "Task Service" cmd /k "cd /d "%~dp0services\task-service" && set NODE_ENV=development && npm start"

REM Start Notification Service
echo Starting Notification Service (Port 3003)...
start "Notification Service" cmd /k "cd /d "%~dp0services\notification-service" && set NODE_ENV=development && npm start"

echo ✅ All services started with NODE_ENV=development
echo 📝 Note: Each service is running in a separate command window
echo 🔍 Check the console output in each window for any errors
pause
