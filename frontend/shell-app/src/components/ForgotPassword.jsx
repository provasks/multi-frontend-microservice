import React, { useState } from 'react';
import { authApi } from '../utils/api.js';
import './LoginForm.css';

const ForgotPassword = ({ onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetData, setResetData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.post('/auth/reset-password', { email });
      
      setResetData(response.data);
      setSuccess(true);
      
      if (window.showSuccess) {
        window.showSuccess('Password reset successfully! Please check the new password below.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      
      let errorMessage = 'Failed to reset password';
      
      if (err.response) {
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
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

  if (success && resetData) {
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
                    <i className="fas fa-check-circle me-3 text-success"></i>
                    Password Reset Successful
                  </h1>
                  <p className="login-subtitle">Your password has been reset</p>
                </div>
                
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Password reset successfully!</strong>
                  <p className="mb-0 mt-2">Please use the new password below to log in.</p>
                </div>

                <div className="password-display-box p-3 mb-3" style={{
                  backgroundColor: '#f8f9fa',
                  border: '2px dashed #28a745',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <label className="text-muted small mb-2 d-block">Your New Password:</label>
                  <div className="d-flex align-items-center justify-content-center">
                    <code style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: '#28a745',
                      letterSpacing: '2px',
                      fontFamily: 'monospace'
                    }}>
                      {resetData.newPassword}
                    </code>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => {
                        navigator.clipboard.writeText(resetData.newPassword);
                        if (window.showSuccess) {
                          window.showSuccess('Password copied to clipboard!');
                        }
                      }}
                      title="Copy to clipboard"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>

                <div className="alert alert-warning" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <small>
                    <strong>Security Note:</strong> Please change this password after logging in for security purposes.
                  </small>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onBackToLogin}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <i className="fas fa-key me-3"></i>
                  Reset Password
                </h1>
                <p className="login-subtitle">Enter your email to reset your password</p>
              </div>
              
              {error && (
                <div className="error-alert" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${error && error.includes('email') ? 'is-invalid' : ''}`}
                    id="resetEmail"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                  <label htmlFor="resetEmail">Email Address</label>
                  <i className="fas fa-envelope input-icon"></i>
                </div>
                
                <button 
                  type="submit" 
                  className="login-btn w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key me-2"></i>
                      Reset Password
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={onBackToLogin}
                  style={{ color: '#6c757d' }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

