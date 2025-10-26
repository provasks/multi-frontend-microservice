#!/usr/bin/env node

/**
 * Clear Rate Limiting Data
 * This script provides instructions to clear rate limiting data
 */

console.log('🧹 Rate Limiting Data Clear Instructions');
console.log('');
console.log('The rate limiting data is stored in memory and will be cleared when you restart the backend services.');
console.log('');
console.log('To clear the rate limiting data:');
console.log('1. Stop all backend services (Ctrl+C in each terminal)');
console.log('2. Restart the backend services');
console.log('');
console.log('Or you can wait for the rate limit window to expire (1 minute in development).');
console.log('');
console.log('✅ Rate limiting configuration has been updated to be more lenient for development');
console.log('   - General requests: 1000 requests per minute (was 500 per 5 minutes)');
console.log('   - Login attempts: 100 attempts per minute (was 20 per 5 minutes)');
console.log('   - Localhost IPs are skipped in development mode');
console.log('');
console.log('🎉 Please restart your backend services to apply the changes');
