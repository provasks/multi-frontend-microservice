import React, { useState } from 'react';
import { authApi } from '../utils/api.js';
import './LoginForm.css';

// Temporary inline validation until shared components are updated
const validateLoginForm = (formData) => {
  const errors = {};
  
  // More lenient email validation - just check for @ symbol
  if (!formData.email || !formData.email.includes('@')) {
    errors.email = 'Valid email is required';
  }
  
  // Password validation - just check if it exists
  if (!formData.password || formData.password.length === 0) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string' && !key.toLowerCase().includes('password')) {
      sanitized[key] = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError('');
    setValidationErrors({});

    console.log('Form data:', formData);

    // Validate form data
    const validation = validateLoginForm(formData);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      setValidationErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      console.log('Making API call...');
      // Sanitize form data before sending
      const sanitizedData = sanitizeFormData(formData);
      console.log('Sanitized data:', sanitizedData);
      
      const response = await authApi.post('/auth/login', sanitizedData);
      console.log('API response:', response);
      
      const { token } = response.data;
      
      if (window.showSuccess) {
        window.showSuccess('Login successful!');
      }
      
      onLogin(token);
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error details:', err);
      
      let errorMessage = 'Login failed';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
        console.log('Server error response:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        console.log('No response error:', err.request);
      } else {
        // Something else happened
        errorMessage = err.message || 'An unexpected error occurred';
        console.log('Other error:', err.message);
      }
      
      setError(errorMessage);
      
      if (window.showError) {
        window.showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return (
    <div className="login-container">
      
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="login-card p-4 p-md-5">
              <div className="login-header">
                <h1 className="login-title">
                  <i className="fas fa-tasks me-3"></i>
                  TaskFlow
                </h1>
                <p className="login-subtitle">Welcome back! Please sign in to your account</p>
              </div>
              
              {error && (
                <div className="error-alert" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} onReset={(e) => e.preventDefault()}>
                <div className="form-floating">
                  <input
                    type="email"
                    className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                  <label htmlFor="email">Email Address</label>
                  <i className="fas fa-envelope input-icon"></i>
                  {validationErrors.email && (
                    <div className="invalid-feedback">
                      {validationErrors.email}
                    </div>
                  )}
                </div>
                
                <div className="form-floating">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <label htmlFor="password">Password</label>
                  <i className="fas fa-lock input-icon"></i>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  {validationErrors.password && (
                    <div className="invalid-feedback">
                      {validationErrors.password}
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </button>
              </form>
              
              <div className="demo-credentials">
                <h6><i className="fas fa-info-circle me-2"></i>Demo Credentials</h6>
                <p><strong>Email:</strong> admin@example.com | <strong>Password:</strong> password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
