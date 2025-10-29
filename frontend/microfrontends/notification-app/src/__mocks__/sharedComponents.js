// Mock shared components for testing
const LoadingSpinner = ({ size, variant, text, showDots }) => {
  return (
    <div data-testid="loading-spinner" data-size={size} data-variant={variant} data-text={text} data-show-dots={showDots}>
      Loading...
    </div>
  );
};

export default LoadingSpinner;
export { LoadingSpinner };

export const ErrorBoundary = ({ children }) => {
  return <div data-testid="error-boundary">{children}</div>;
};

export const FloatingMessageManager = () => {
  return <div data-testid="floating-message-manager"></div>;
};
