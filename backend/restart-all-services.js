#!/usr/bin/env node

/**
 * Restart All Backend Services
 * This script provides instructions to restart all backend services to apply rate limiting changes
 */

console.log('🔄 Backend Services Restart Instructions');
console.log('');
console.log('Rate limiting has been disabled for development in all backend services.');
console.log('You need to restart all backend services to apply the changes.');
console.log('');
console.log('Services to restart:');
console.log('1. API Gateway (port 3000)');
console.log('2. User Service (port 3001)');
console.log('3. Task Service (port 3002)');
console.log('4. Notification Service (port 3003)');
console.log('');
console.log('To restart all services:');
console.log('');
console.log('1. Stop all running backend services (Ctrl+C in each terminal)');
console.log('');
console.log('2. Start each service in separate terminals:');
console.log('   Terminal 1: cd backend/api-gateway && npm start');
console.log('   Terminal 2: cd backend/services/user-service && npm start');
console.log('   Terminal 3: cd backend/services/task-service && npm start');
console.log('   Terminal 4: cd backend/services/notification-service && npm start');
console.log('');
console.log('Or use the docker-compose (if available):');
console.log('   cd backend && docker-compose up');
console.log('');
console.log('✅ Changes applied:');
console.log('   - API Gateway: 10,000 requests per 15 minutes for development');
console.log('   - User Service: Rate limiting disabled in development');
console.log('   - Task Service: Rate limiting disabled in development');
console.log('   - Notification Service: Rate limiting disabled in development');
console.log('   - All services: Localhost requests not rate limited');
console.log('');
console.log('🎉 After restarting, the "Too many requests" error should be resolved!');
