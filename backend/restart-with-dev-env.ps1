# PowerShell script to restart backend services with NODE_ENV=development

Write-Host "🔄 Restarting Backend Services with NODE_ENV=development" -ForegroundColor Green

# Set environment variable for current session
$env:NODE_ENV = "development"

Write-Host "✅ NODE_ENV set to: $env:NODE_ENV" -ForegroundColor Yellow

# Kill existing Node.js processes on ports 3000-3003
Write-Host "🛑 Stopping existing services..." -ForegroundColor Red

$ports = @(3000, 3001, 3002, 3003)
foreach ($port in $ports) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($processes) {
        foreach ($pid in $processes) {
            try {
                Stop-Process -Id $pid -Force
                Write-Host "   Stopped process $pid on port $port" -ForegroundColor Yellow
            } catch {
                Write-Host "   Could not stop process $pid on port $port" -ForegroundColor Red
            }
        }
    }
}

# Wait a moment for processes to stop
Start-Sleep -Seconds 2

Write-Host "🚀 Starting services with NODE_ENV=development..." -ForegroundColor Green

# Start API Gateway
Write-Host "Starting API Gateway (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Projects\learning\nodejs\Task Management System\backend\api-gateway'; `$env:NODE_ENV='development'; npm start" -WindowStyle Normal

# Start User Service
Write-Host "Starting User Service (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Projects\learning\nodejs\Task Management System\backend\services\user-service'; `$env:NODE_ENV='development'; npm start" -WindowStyle Normal

# Start Task Service
Write-Host "Starting Task Service (Port 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Projects\learning\nodejs\Task Management System\backend\services\task-service'; `$env:NODE_ENV='development'; npm start" -WindowStyle Normal

# Start Notification Service
Write-Host "Starting Notification Service (Port 3003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Projects\learning\nodejs\Task Management System\backend\services\notification-service'; `$env:NODE_ENV='development'; npm start" -WindowStyle Normal

Write-Host "✅ All services started with NODE_ENV=development" -ForegroundColor Green
Write-Host "📝 Note: Each service is running in a separate PowerShell window" -ForegroundColor Yellow
Write-Host "🔍 Check the console output in each window for any errors" -ForegroundColor Yellow
