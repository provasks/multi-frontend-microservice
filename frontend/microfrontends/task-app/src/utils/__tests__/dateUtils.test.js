// Mock date utilities for testing
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isDateInPast = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const isDateToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const targetDate = new Date(date);
  return today.toDateString() === targetDate.toDateString();
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-12-31T23:59:59.000Z';
      const formatted = formatDate(date);
      // The date might be formatted differently based on timezone
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('handles null input', () => {
      expect(formatDate(null)).toBe('');
    });

    it('handles undefined input', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('handles empty string', () => {
      expect(formatDate('')).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const date = '2024-12-31T15:30:00.000Z';
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
    });

    it('handles null input', () => {
      expect(formatDateTime(null)).toBe('');
    });
  });

  describe('isDateInPast', () => {
    it('returns true for past dates', () => {
      const pastDate = '2020-01-01T00:00:00.000Z';
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
      const futureDate = '2030-01-01T00:00:00.000Z';
      expect(isDateInPast(futureDate)).toBe(false);
    });

    it('handles null input', () => {
      expect(isDateInPast(null)).toBe(false);
    });
  });

  describe('isDateToday', () => {
    it('returns true for today', () => {
      const today = new Date().toISOString();
      expect(isDateToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isDateToday(yesterday.toISOString())).toBe(false);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isDateToday(tomorrow.toISOString())).toBe(false);
    });

    it('handles null input', () => {
      expect(isDateToday(null)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('adds days correctly', () => {
      const date = new Date('2024-01-01');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(6);
    });

    it('handles negative days', () => {
      const date = new Date('2024-01-10');
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(5);
    });

    it('handles zero days', () => {
      const date = new Date('2024-01-01');
      const result = addDays(date, 0);
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('getDaysUntilDue', () => {
    it('calculates days until due correctly', () => {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 5);
      
      const days = getDaysUntilDue(dueDate.toISOString());
      expect(days).toBe(5);
    });

    it('returns negative number for past dates', () => {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() - 3);
      
      const days = getDaysUntilDue(dueDate.toISOString());
      expect(days).toBe(-3);
    });

    it('handles null input', () => {
      expect(getDaysUntilDue(null)).toBe(null);
    });

    it('handles undefined input', () => {
      expect(getDaysUntilDue(undefined)).toBe(null);
    });
  });
});
