import { USER_CONSTANTS, API_ENDPOINTS, ROUTES, VALIDATION_RULES, UI_CONFIG } from '../userAppConfig';

describe('userAppConfig', () => {
  describe('USER_CONSTANTS', () => {
    it('should have correct DEFAULT_FORM structure', () => {
      expect(USER_CONSTANTS.DEFAULT_FORM).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        role: 'user',
        isActive: true
      });
    });

    it('should have correct ROLES', () => {
      expect(USER_CONSTANTS.ROLES).toEqual({
        USER: 'user',
        ADMIN: 'admin'
      });
    });

    it('should have correct STATUS', () => {
      expect(USER_CONSTANTS.STATUS).toEqual({
        ACTIVE: 'active',
        INACTIVE: 'inactive'
      });
    });

    it('should have correct ROLE_OPTIONS', () => {
      expect(USER_CONSTANTS.ROLE_OPTIONS).toEqual([
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Administrator' }
      ]);
    });

    it('should have correct STATUS_OPTIONS', () => {
      expect(USER_CONSTANTS.STATUS_OPTIONS).toEqual([
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]);
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have correct API endpoints', () => {
      expect(API_ENDPOINTS).toEqual({
        USERS: 'http://localhost:3001/api/users',
        USER_BY_ID: (id) => `http://localhost:3001/api/users/${id}`,
        USER_PROFILE: 'http://localhost:3001/api/users/profile',
        USER_STATS: 'http://localhost:3001/api/users/stats'
      });
    });

    it('should generate correct USER_BY_ID endpoint', () => {
      expect(API_ENDPOINTS.USER_BY_ID('123')).toBe('http://localhost:3001/api/users/123');
    });
  });

  describe('ROUTES', () => {
    it('should have correct routes', () => {
      expect(ROUTES).toEqual({
        USERS: '/users',
        USER_DETAILS: (id) => `/users/${id}`,
        USER_EDIT: (id) => `/users/${id}/edit`,
        USER_CREATE: '/users/create'
      });
    });

    it('should generate correct USER_DETAILS route', () => {
      expect(ROUTES.USER_DETAILS('123')).toBe('/users/123');
    });

    it('should generate correct USER_EDIT route', () => {
      expect(ROUTES.USER_EDIT('123')).toBe('/users/123/edit');
    });
  });

  describe('VALIDATION_RULES', () => {
    it('should have correct validation rules', () => {
      expect(VALIDATION_RULES).toEqual({
        USERNAME: {
          minLength: 3,
          maxLength: 30,
          pattern: /^[a-zA-Z0-9_]+$/
        },
        PASSWORD: {
          minLength: 6,
          maxLength: 128
        },
        EMAIL: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        NAME: {
          minLength: 1,
          maxLength: 50,
          pattern: /^[a-zA-Z\s]+$/
        }
      });
    });

    it('should validate username pattern correctly', () => {
      const usernamePattern = VALIDATION_RULES.USERNAME.pattern;
      expect(usernamePattern.test('valid_username123')).toBe(true);
      expect(usernamePattern.test('invalid-username')).toBe(false);
      expect(usernamePattern.test('invalid username')).toBe(false);
    });

    it('should validate email pattern correctly', () => {
      const emailPattern = VALIDATION_RULES.EMAIL.pattern;
      expect(emailPattern.test('test@example.com')).toBe(true);
      expect(emailPattern.test('invalid-email')).toBe(false);
      expect(emailPattern.test('test@')).toBe(false);
    });

    it('should validate name pattern correctly', () => {
      const namePattern = VALIDATION_RULES.NAME.pattern;
      expect(namePattern.test('John Doe')).toBe(true);
      expect(namePattern.test('John123')).toBe(false);
      expect(namePattern.test('John-Doe')).toBe(false);
    });
  });

  describe('UI_CONFIG', () => {
    it('should have correct UI configuration', () => {
      expect(UI_CONFIG).toEqual({
        PAGINATION: {
          DEFAULT_PAGE_SIZE: 10,
          PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
        },
        TABLE: {
          DEFAULT_SORT_FIELD: 'createdAt',
          DEFAULT_SORT_ORDER: 'desc'
        },
        MODAL: {
          BACKDROP: 'static',
          KEYBOARD: true
        },
        NOTIFICATIONS: {
          AUTO_HIDE_DURATION: 5000,
          MAX_NOTIFICATIONS: 5
        }
      });
    });

    it('should have correct pagination configuration', () => {
      expect(UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE).toBe(10);
      expect(UI_CONFIG.PAGINATION.PAGE_SIZE_OPTIONS).toEqual([5, 10, 20, 50]);
    });

    it('should have correct table configuration', () => {
      expect(UI_CONFIG.TABLE.DEFAULT_SORT_FIELD).toBe('createdAt');
      expect(UI_CONFIG.TABLE.DEFAULT_SORT_ORDER).toBe('desc');
    });

    it('should have correct modal configuration', () => {
      expect(UI_CONFIG.MODAL.BACKDROP).toBe('static');
      expect(UI_CONFIG.MODAL.KEYBOARD).toBe(true);
    });

    it('should have correct notifications configuration', () => {
      expect(UI_CONFIG.NOTIFICATIONS.AUTO_HIDE_DURATION).toBe(5000);
      expect(UI_CONFIG.NOTIFICATIONS.MAX_NOTIFICATIONS).toBe(5);
    });
  });
});
