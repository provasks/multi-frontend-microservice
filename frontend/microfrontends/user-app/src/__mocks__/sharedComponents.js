// Mock shared components
const LoadingSpinner = ({ size, variant, text, showDots }) => {
  return (
    <div data-testid="loading-spinner" data-size={size} data-variant={variant} data-text={text} data-show-dots={showDots}>
      Loading...
    </div>
  );
};

export default LoadingSpinner;

export const useAuth = () => ({
  makeAuthenticatedRequest: jest.fn().mockResolvedValue({
    data: { users: [] }
  }),
  isAuthenticated: jest.fn(() => true),
  token: 'test-token'
});

export const USER_CONSTANTS = {
  DEFAULT_FORM: {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: 'user',
    isActive: true
  },
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  }
};
