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
    console.error('Task App Error:', error);
    console.error('Error Info:', errorInfo);
    
    if (window.showError) {
      const errorMessage = error?.message || (error === null ? 'null' : error) || 'Unknown error';
      window.showError(`Task Management error: ${errorMessage}`);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger">
          <h6>Task Management Error</h6>
          <p>There was an error in the Task Management module.</p>
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
