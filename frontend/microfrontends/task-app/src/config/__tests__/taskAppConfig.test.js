import { TASK_APP_CONFIG, TASK_APP_MESSAGES, TASK_CONSTANTS, MESSAGES } from '../taskAppConfig';

describe('Task App Configuration', () => {
  describe('TASK_APP_CONFIG', () => {
    it('should have correct app metadata', () => {
      expect(TASK_APP_CONFIG.APP.NAME).toBe('Task Management');
      expect(TASK_APP_CONFIG.APP.VERSION).toBe('1.0.0');
      expect(TASK_APP_CONFIG.APP.DESCRIPTION).toBe('Task management microfrontend');
    });

    it('should have correct pagination configuration', () => {
      expect(TASK_APP_CONFIG.TASK_MANAGEMENT.PAGINATION.DEFAULT_PAGE_SIZE).toBe(10);
      expect(TASK_APP_CONFIG.TASK_MANAGEMENT.PAGINATION.PAGE_SIZE_OPTIONS).toEqual([5, 10, 25, 50]);
    });

    it('should have correct search configuration', () => {
      expect(TASK_APP_CONFIG.TASK_MANAGEMENT.SEARCH.DEBOUNCE_DELAY).toBe(300);
      expect(TASK_APP_CONFIG.TASK_MANAGEMENT.SEARCH.MIN_SEARCH_LENGTH).toBe(2);
      expect(TASK_APP_CONFIG.TASK_MANAGEMENT.SEARCH.SEARCH_FIELDS).toEqual(['title', 'description', 'assignedTo']);
    });

    it('should have correct form validation configuration', () => {
      const validation = TASK_APP_CONFIG.TASK_MANAGEMENT.FORM.VALIDATION;
      
      expect(validation.TITLE.MIN_LENGTH).toBe(1);
      expect(validation.TITLE.MAX_LENGTH).toBe(200);
      expect(validation.TITLE.REQUIRED).toBe(true);
      
      expect(validation.DESCRIPTION.MAX_LENGTH).toBe(1000);
      expect(validation.DESCRIPTION.REQUIRED).toBe(false);
      
      expect(validation.DUE_DATE.MIN_DATE).toBeDefined();
    });

    it('should have correct form fields configuration', () => {
      const fields = TASK_APP_CONFIG.TASK_MANAGEMENT.FORM.FIELDS;
      
      expect(fields.REQUIRED).toEqual(['title', 'priority', 'status']);
      expect(fields.OPTIONAL).toEqual(['description', 'assignedTo', 'dueDate']);
    });

    it('should have correct list configuration', () => {
      const list = TASK_APP_CONFIG.TASK_MANAGEMENT.LIST;
      
      expect(list.SORTABLE_COLUMNS).toEqual(['title', 'priority', 'status', 'assignedTo', 'dueDate', 'createdAt']);
      expect(list.DEFAULT_SORT.field).toBe('createdAt');
      expect(list.DEFAULT_SORT.direction).toBe('desc');
      expect(list.FILTERABLE_FIELDS).toEqual(['priority', 'status', 'assignedTo']);
    });

    it('should have correct board configuration', () => {
      const board = TASK_APP_CONFIG.TASK_MANAGEMENT.BOARD;
      
      expect(board.COLUMNS).toHaveLength(3);
      expect(board.COLUMNS[0].id).toBe('pending');
      expect(board.COLUMNS[1].id).toBe('in_progress');
      expect(board.COLUMNS[2].id).toBe('completed');
      
      expect(board.CARD_CONFIG.MAX_TITLE_LENGTH).toBe(50);
      expect(board.CARD_CONFIG.MAX_DESCRIPTION_LENGTH).toBe(100);
      expect(board.CARD_CONFIG.SHOW_PRIORITY).toBe(true);
      expect(board.CARD_CONFIG.SHOW_ASSIGNEE).toBe(true);
      expect(board.CARD_CONFIG.SHOW_DUE_DATE).toBe(true);
    });

    it('should have correct API configuration', () => {
      const api = TASK_APP_CONFIG.API;
      
      expect(api.ENDPOINTS.TASKS).toBe('/api/tasks');
      expect(api.ENDPOINTS.TASK_ASSIGN).toBe('/api/tasks/assign');
      expect(api.ENDPOINTS.TASK_COMPLETE).toBe('/api/tasks/complete');
      
      expect(api.TIMEOUTS.DEFAULT).toBe(10000);
      expect(api.TIMEOUTS.UPLOAD).toBe(30000);
    });
  });

  describe('TASK_APP_MESSAGES', () => {
    it('should have correct error messages', () => {
      const errors = TASK_APP_MESSAGES.ERROR;
      
      expect(errors.TASK_LOAD_FAILED).toBe('Failed to load tasks');
      expect(errors.TASK_CREATE_FAILED).toBe('Failed to create task');
      expect(errors.TASK_UPDATE_FAILED).toBe('Failed to update task');
      expect(errors.TASK_DELETE_FAILED).toBe('Failed to delete task');
      expect(errors.TASK_NOT_FOUND).toBe('Task not found');
      expect(errors.INVALID_TASK_DATA).toBe('Invalid task data provided');
      expect(errors.TASK_ASSIGN_FAILED).toBe('Failed to assign task');
      expect(errors.TASK_COMPLETE_FAILED).toBe('Failed to complete task');
    });

    it('should have correct success messages', () => {
      const success = TASK_APP_MESSAGES.SUCCESS;
      
      expect(success.TASK_CREATED).toBe('Task created successfully');
      expect(success.TASK_UPDATED).toBe('Task updated successfully');
      expect(success.TASK_DELETED).toBe('Task deleted successfully');
      expect(success.TASKS_LOADED).toBe('Tasks loaded successfully');
      expect(success.TASK_ASSIGNED).toBe('Task assigned successfully');
      expect(success.TASK_COMPLETED).toBe('Task completed successfully');
    });
  });

  describe('Re-exported constants', () => {
    it('should re-export TASK_CONSTANTS', () => {
      expect(TASK_CONSTANTS).toBeDefined();
    });

    it('should re-export MESSAGES', () => {
      expect(MESSAGES).toBeDefined();
    });
  });
});
