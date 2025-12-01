const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers({ page, limit, search, role }) {
    try {
      // Build filter
      const filter = {};
      
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (role) {
        filter.role = role;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      const users = await User.find(filter)
        .select('-password') // Exclude password from results
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(filter);

      return {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId, updateData, currentUserId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return null;
      }

      // Update user fields
      const allowedFields = ['firstName', 'lastName', 'email', 'username', 'role'];
      const updates = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      }

      // Only admin can change role
      if (updates.role && userId !== currentUserId) {
        const currentUser = await User.findById(currentUserId);
        if (currentUser.role !== 'admin') {
          delete updates.role;
        }
      }

      Object.assign(user, updates);
      await user.save();

      // Return user without password
      const updatedUser = await User.findById(userId).select('-password');
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  /**
   * Delete/deactivate user
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      return !!user;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, currentPassword, newPassword, currentUserRole) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return false;
      }

      // If not admin, verify current password
      if (currentUserRole !== 'admin') {
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return false;
        }
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password directly using updateOne to bypass pre-save hook
      // This prevents double hashing since the password is already hashed
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedNewPassword } }
      );
      
      return true;
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }

  /**
   * Reset user password by email (for forgot password)
   * Returns the new password for development purposes
   * In production, this should send an email with reset link
   */
  async resetPasswordByEmail(email, newPassword = null) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Generate new password if not provided
      if (!newPassword) {
        // Generate a random password
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        newPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      }

      // Validate password length
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password directly (bypass pre-save hook to avoid double hashing)
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      
      return { 
        success: true, 
        newPassword, 
        user: {
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
    } catch (error) {
      console.error('Error in resetPasswordByEmail:', error);
      throw error;
    }
  }

  /**
   * Create a new user (for registration)
   */
  async createUser(userData) {
    try {
      const { firstName, lastName, email, username, password, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role
      });

      await user.save();

      // Return user without password
      const newUser = await User.findById(user._id).select('-password');
      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  /**
   * Authenticate user (for login)
   */
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const authenticatedUser = await User.findById(user._id).select('-password');
      return authenticatedUser;
    } catch (error) {
      console.error('Error in authenticateUser:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
