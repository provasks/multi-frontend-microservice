// Validation utilities for task forms
export const validateTaskForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Validate title
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Title is required';
    isValid = false;
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
    isValid = false;
  }

  // Validate description
  if (!formData.description || formData.description.trim() === '') {
    errors.description = 'Description is required';
    isValid = false;
  } else if (formData.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
    isValid = false;
  }

  // Validate priority
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!formData.priority || !validPriorities.includes(formData.priority)) {
    errors.priority = 'Priority must be one of: low, medium, high, urgent';
    isValid = false;
  }

  // Validate status
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  if (!formData.status || !validStatuses.includes(formData.status)) {
    errors.status = 'Status must be one of: pending, in_progress, completed, cancelled';
    isValid = false;
  }

  // Validate assignedTo (optional but if provided, should be valid email)
  if (formData.assignedTo && formData.assignedTo.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.assignedTo)) {
      errors.assignedTo = 'Assigned To must be a valid email address';
      isValid = false;
    }
  }

  // Validate dueDate (optional but if provided, should be valid date)
  if (formData.dueDate && formData.dueDate.trim() !== '') {
    const date = new Date(formData.dueDate);
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Due Date must be a valid date';
      isValid = false;
    }
  }

  // Validate tags (optional but if provided, should be comma-separated)
  if (formData.tags && formData.tags.trim() !== '') {
    const tags = formData.tags.split(',').map(tag => tag.trim());
    if (tags.some(tag => tag.length === 0)) {
      errors.tags = 'Tags cannot contain empty values';
      isValid = false;
    }
  }

  return {
    isValid,
    errors
  };
};

export const validateUserForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Validate username
  if (!formData.username || formData.username.trim() === '') {
    errors.username = 'Username is required';
    isValid = false;
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
    isValid = false;
  }

  // Validate email
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email must be a valid email address';
      isValid = false;
    }
  }

  // Validate password (only required for new users)
  if (formData.isNewUser) {
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
  }

  // Validate firstName
  if (!formData.firstName || formData.firstName.trim() === '') {
    errors.firstName = 'First name is required';
    isValid = false;
  }

  // Validate lastName
  if (!formData.lastName || formData.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
    isValid = false;
  }

  return {
    isValid,
    errors
  };
};
