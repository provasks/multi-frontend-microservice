#!/usr/bin/env node

/**
 * Clear API Gateway Rate Limiting Data
 * This script provides instructions to clear rate limiting data from the API Gateway
 */

console.log('🧹 API Gateway Rate Limiting Data Clear Instructions');
console.log('');
console.log('The API Gateway rate limiting data is stored in memory and will be cleared when you restart the API Gateway service.');
console.log('');
console.log('To clear the rate limiting data:');
console.log('1. Stop the API Gateway service (Ctrl+C in the terminal running it)');
console.log('2. Restart the API Gateway service');
console.log('');
console.log('Or you can wait for the rate limit window to expire (15 minutes).');
console.log('');
console.log('✅ API Gateway rate limiting configuration has been updated to be more lenient for development');
console.log('   - Development: 10,000 requests per 15 minutes (was 100)');
console.log('   - Localhost IPs are skipped in development mode');
console.log('   - Production: 100 requests per 15 minutes (unchanged)');
console.log('');
console.log('🎉 Please restart your API Gateway service to apply the changes');
console.log('');
console.log('To restart the API Gateway:');
console.log('cd backend/api-gateway');
console.log('npm start');
