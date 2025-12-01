/**
 * Password Reset Script
 * 
 * This script allows you to reset a user's password directly in the database.
 * 
 * Usage (from user-service directory):
 *   node scripts/reset-password.js <email> <newPassword>
 * 
 * Example:
 *   node scripts/reset-password.js provasks@gmail.com newpassword123
 * 
 * Note: Make sure MongoDB is running and the connection string is correct.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// MongoDB connection string
const MONGODB_URI = process.env.USER_MONGODB_URI || 
                   process.env.MONGODB_URI || 
                   'mongodb://localhost:27017/tms_users';

async function resetPassword(email, newPassword) {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log(`Using URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`); // Hide credentials
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find user by email
    console.log(`\nLooking for user with email: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User with email ${email} not found!`);
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.username} (${user.email})`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      console.error('❌ Password must be at least 6 characters long!');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash the new password
    console.log('\nHashing new password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password (bypass the pre-save hook to avoid double hashing)
    console.log('Updating password in database...');
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    console.log('\n✅ Password reset successfully!');
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log('\n⚠️  Please change this password after logging in for security.');

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');

  } catch (error) {
    console.error('\n❌ Error resetting password:', error.message);
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Could not connect to MongoDB. Please check:');
      console.error('   1. MongoDB is running');
      console.error('   2. MONGODB_URI is correct in .env file');
      console.error(`   3. Current MONGODB_URI: ${MONGODB_URI}`);
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('\n❌ Usage: node scripts/reset-password.js <email> <newPassword>');
  console.error('\nExample:');
  console.error('  node scripts/reset-password.js provasks@gmail.com newpassword123');
  console.error('\nNote: Password must be at least 6 characters long.');
  process.exit(1);
}

const [email, newPassword] = args;

// Run the script
resetPassword(email, newPassword);

