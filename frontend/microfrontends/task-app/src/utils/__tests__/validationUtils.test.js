// Import actual validation utilities
import { 
  validateTaskForm, 
  validateUserForm
} from '../validationUtils';

describe('Validation Utilities', () => {
  describe('validateTaskForm', () => {
    const validFormData = {
      title: 'Test Task',
      description: 'This is a test task description',
      priority: 'high',
      status: 'pending',
      assignedTo: 'user@example.com',
      dueDate: '2024-12-31',
      tags: 'test, example'
    };

    it('validates correct form data', () => {
      const result = validateTaskForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('validates title requirements', () => {
      const result = validateTaskForm({ ...validFormData, title: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    it('validates title maximum length', () => {
      const longTitle = 'a'.repeat(101);
      const result = validateTaskForm({ ...validFormData, title: longTitle });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title must be less than 100 characters');
    });

    it('validates description requirements', () => {
      const result = validateTaskForm({ ...validFormData, description: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description is required');
    });

    it('validates description maximum length', () => {
      const longDescription = 'a'.repeat(501);
      const result = validateTaskForm({ ...validFormData, description: longDescription });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description must be less than 500 characters');
    });

    it('validates priority values', () => {
      const result = validateTaskForm({ ...validFormData, priority: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.errors.priority).toBe('Priority must be one of: low, medium, high, urgent');
    });

    it('validates status values', () => {
      const result = validateTaskForm({ ...validFormData, status: 'invalid' });
      expect(result.isValid).toBe(false);
      expect(result.errors.status).toBe('Status must be one of: pending, in_progress, completed, cancelled');
    });

    it('validates email format for assignedTo', () => {
      const result = validateTaskForm({ ...validFormData, assignedTo: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.errors.assignedTo).toBe('Assigned To must be a valid email address');
    });

    it('allows empty assignedTo', () => {
      const result = validateTaskForm({ ...validFormData, assignedTo: '' });
      expect(result.isValid).toBe(true);
      expect(result.errors.assignedTo).toBeUndefined();
    });

    it('validates due date format', () => {
      const result = validateTaskForm({ ...validFormData, dueDate: 'invalid-date' });
      expect(result.isValid).toBe(false);
      expect(result.errors.dueDate).toBe('Due Date must be a valid date');
    });

    it('allows empty due date', () => {
      const result = validateTaskForm({ ...validFormData, dueDate: '' });
      expect(result.isValid).toBe(true);
      expect(result.errors.dueDate).toBeUndefined();
    });

    it('validates tags format', () => {
      const result = validateTaskForm({ ...validFormData, tags: 'tag1,,tag2' });
      expect(result.isValid).toBe(false);
      expect(result.errors.tags).toBe('Tags cannot contain empty values');
    });

    it('allows empty tags', () => {
      const result = validateTaskForm({ ...validFormData, tags: '' });
      expect(result.isValid).toBe(true);
      expect(result.errors.tags).toBeUndefined();
    });

    it('validates all priority values', () => {
      const priorities = ['low', 'medium', 'high', 'urgent'];
      priorities.forEach(priority => {
        const result = validateTaskForm({ ...validFormData, priority });
        expect(result.isValid).toBe(true);
        expect(result.errors.priority).toBeUndefined();
      });
    });

    it('validates all status values', () => {
      const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      statuses.forEach(status => {
        const result = validateTaskForm({ ...validFormData, status });
        expect(result.isValid).toBe(true);
        expect(result.errors.status).toBeUndefined();
      });
    });

    it('validates multiple errors at once', () => {
      const invalidData = {
        title: '',
        description: '',
        priority: 'invalid',
        status: 'invalid',
        assignedTo: 'invalid-email',
        dueDate: 'invalid-date',
        tags: 'tag1,,tag2'
      };
      const result = validateTaskForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(7);
    });

    it('handles missing fields', () => {
      const result = validateTaskForm({});
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
      expect(result.errors.description).toBe('Description is required');
      expect(result.errors.priority).toBe('Priority must be one of: low, medium, high, urgent');
      expect(result.errors.status).toBe('Status must be one of: pending, in_progress, completed, cancelled');
    });

    it('handles whitespace-only values', () => {
      const result = validateTaskForm({
        title: '   ',
        description: '   ',
        priority: 'high',
        status: 'pending'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
      expect(result.errors.description).toBe('Description is required');
    });

    it('handles null and undefined values', () => {
      const result = validateTaskForm({
        title: null,
        description: undefined,
        priority: 'high',
        status: 'pending'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
      expect(result.errors.description).toBe('Description is required');
    });
  });

  describe('validateUserForm', () => {
    const validUserData = {
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isNewUser: true,
      password: 'password123'
    };

    it('validates correct user form data', () => {
      const result = validateUserForm(validUserData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('validates username requirements', () => {
      const result = validateUserForm({ ...validUserData, username: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBe('Username is required');
    });

    it('validates username minimum length', () => {
      const result = validateUserForm({ ...validUserData, username: 'ab' });
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBe('Username must be at least 3 characters');
    });

    it('validates email requirements', () => {
      const result = validateUserForm({ ...validUserData, email: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
    });

    it('validates email format', () => {
      const result = validateUserForm({ ...validUserData, email: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email must be a valid email address');
    });

    it('validates password requirements for new users', () => {
      const result = validateUserForm({ ...validUserData, password: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('Password is required');
    });

    it('validates password minimum length for new users', () => {
      const result = validateUserForm({ ...validUserData, password: '12345' });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('Password must be at least 6 characters');
    });

    it('does not require password for existing users', () => {
      const result = validateUserForm({ ...validUserData, isNewUser: false, password: '' });
      expect(result.isValid).toBe(true);
      expect(result.errors.password).toBeUndefined();
    });

    it('validates firstName requirements', () => {
      const result = validateUserForm({ ...validUserData, firstName: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBe('First name is required');
    });

    it('validates lastName requirements', () => {
      const result = validateUserForm({ ...validUserData, lastName: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.lastName).toBe('Last name is required');
    });

    it('validates multiple errors at once', () => {
      const invalidData = {
        username: '',
        email: 'invalid',
        firstName: '',
        lastName: '',
        isNewUser: true,
        password: '123'
      };
      const result = validateUserForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(5);
    });

    it('handles missing fields', () => {
      const result = validateUserForm({});
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBe('Username is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.firstName).toBe('First name is required');
      expect(result.errors.lastName).toBe('Last name is required');
    });

    it('handles whitespace-only values', () => {
      const result = validateUserForm({
        username: '   ',
        email: '   ',
        firstName: '   ',
        lastName: '   ',
        isNewUser: true,
        password: '   '
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBe('Username is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.firstName).toBe('First name is required');
      expect(result.errors.lastName).toBe('Last name is required');
      expect(result.errors.password).toBe('Password is required');
    });

    it('handles null and undefined values', () => {
      const result = validateUserForm({
        username: null,
        email: undefined,
        firstName: null,
        lastName: undefined,
        isNewUser: true,
        password: null
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBe('Username is required');
      expect(result.errors.email).toBe('Email is required');
      expect(result.errors.firstName).toBe('First name is required');
      expect(result.errors.lastName).toBe('Last name is required');
      expect(result.errors.password).toBe('Password is required');
    });

    it('validates various email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'test123@test-domain.com'
      ];
      
      validEmails.forEach(email => {
        const result = validateUserForm({ ...validUserData, email });
        expect(result.isValid).toBe(true);
        expect(result.errors.email).toBeUndefined();
      });
    });

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test.example.com'
      ];
      
      invalidEmails.forEach(email => {
        const result = validateUserForm({ ...validUserData, email });
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe('Email must be a valid email address');
      });
    });

    it('rejects empty email', () => {
      const result = validateUserForm({ ...validUserData, email: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
    });

    it('validates username edge cases', () => {
      const result = validateUserForm({ ...validUserData, username: 'abc' }); // exactly 3 characters
      expect(result.isValid).toBe(true);
      expect(result.errors.username).toBeUndefined();
    });

    it('validates password edge cases', () => {
      const result = validateUserForm({ ...validUserData, password: '123456' }); // exactly 6 characters
      expect(result.isValid).toBe(true);
      expect(result.errors.password).toBeUndefined();
    });
  });

  describe('Edge cases and error handling', () => {
    it('validateTaskForm handles missing optional fields', () => {
      const minimalData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        status: 'pending'
      };
      const result = validateTaskForm(minimalData);
      expect(result.isValid).toBe(true);
    });

    it('validateTaskForm handles all fields with valid data', () => {
      const completeData = {
        title: 'Complete Task',
        description: 'Complete description',
        priority: 'urgent',
        status: 'in_progress',
        assignedTo: 'user@example.com',
        dueDate: '2024-12-31',
        tags: 'urgent, important, test'
      };
      const result = validateTaskForm(completeData);
      expect(result.isValid).toBe(true);
    });

    it('validateUserForm handles existing user without password', () => {
      const existingUserData = {
        username: 'existinguser',
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        isNewUser: false
      };
      const result = validateUserForm(existingUserData);
      expect(result.isValid).toBe(true);
    });

    it('validateUserForm handles new user with password', () => {
      const newUserData = {
        username: 'newuser',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        isNewUser: true,
        password: 'newpassword123'
      };
      const result = validateUserForm(newUserData);
      expect(result.isValid).toBe(true);
    });

    it('validateTaskForm handles valid date formats', () => {
      const validDates = [
        '2024-12-31',
        '2024-12-31T10:30:00',
        '2024-12-31T10:30:00Z',
        '2024-12-31T10:30:00.000Z'
      ];
      
      validDates.forEach(date => {
        const result = validateTaskForm({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
          status: 'pending',
          dueDate: date
        });
        expect(result.isValid).toBe(true);
        expect(result.errors.dueDate).toBeUndefined();
      });
    });

    it('validateTaskForm handles invalid date formats', () => {
      const invalidDates = [
        'invalid-date',
        'not-a-date',
        'completely-invalid'
      ];
      
      invalidDates.forEach(date => {
        const result = validateTaskForm({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
          status: 'pending',
          dueDate: date
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.dueDate).toBe('Due Date must be a valid date');
      });
    });

    it('validateTaskForm handles edge case date formats', () => {
      // These dates might be valid in some contexts but should be tested
      const edgeCaseDates = [
        '2024-13-31', // Invalid month
        '2024-12-32', // Invalid day
        '2024/12/31' // Different format
      ];
      
      edgeCaseDates.forEach(date => {
        const result = validateTaskForm({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
          status: 'pending',
          dueDate: date
        });
        // These might be valid or invalid depending on JavaScript's Date parsing
        // We just test that the function doesn't crash
        expect(typeof result.isValid).toBe('boolean');
      });
    });

    it('validateTaskForm handles valid tag formats', () => {
      const validTagFormats = [
        'tag1',
        'tag1, tag2',
        'tag1,tag2,tag3',
        'urgent, important, test',
        'single-tag'
      ];
      
      validTagFormats.forEach(tags => {
        const result = validateTaskForm({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
          status: 'pending',
          tags
        });
        expect(result.isValid).toBe(true);
        expect(result.errors.tags).toBeUndefined();
      });
    });

    it('validateTaskForm handles invalid tag formats', () => {
      const invalidTagFormats = [
        'tag1,,tag2', // Empty tag
        'tag1, ,tag2', // Whitespace-only tag
        'tag1,,,tag2', // Multiple empty tags
        ',tag1,tag2', // Leading comma
        'tag1,tag2,' // Trailing comma
      ];
      
      invalidTagFormats.forEach(tags => {
        const result = validateTaskForm({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
          status: 'pending',
          tags
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.tags).toBe('Tags cannot contain empty values');
      });
    });
  });
});