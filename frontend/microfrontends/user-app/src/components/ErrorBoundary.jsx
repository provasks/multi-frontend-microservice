import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('User App Error:', error);
    console.error('Error Info:', errorInfo);
    
    if (window.showError) {
      window.showError(`User Management error: ${error.message}`);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger">
          <h6>User Management Error</h6>
          <p>There was an error in the User Management module.</p>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
