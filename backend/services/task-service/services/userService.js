const axios = require('axios');

const userService = {
  async getUserById(userId, authToken) {
    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL || 'http://localhost:3001'}/api/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
  },

  async getUserByEmail(email, authToken) {
    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL || 'http://localhost:3001'}/api/users/email/${email}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error.message);
      return null;
    }
  }
};

module.exports = userService;

