import {
  formatDate,
  formatDateTime,
  isDateInPast,
  isDateToday,
  addDays,
  getDaysUntilDue
} from '../dateUtils';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-12-31T23:59:59.000Z';
      const formatted = formatDate(date);
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

    it('handles invalid date string', () => {
      const formatted = formatDate('invalid-date');
      expect(formatted).toBe('Invalid Date');
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

    it('handles undefined input', () => {
      expect(formatDateTime(undefined)).toBe('');
    });

    it('handles empty string', () => {
      expect(formatDateTime('')).toBe('');
    });
  });

  describe('isDateInPast', () => {
    it('returns true for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isDateInPast(futureDate)).toBe(false);
    });

    it('returns false for null input', () => {
      expect(isDateInPast(null)).toBe(false);
    });

    it('returns false for undefined input', () => {
      expect(isDateInPast(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isDateInPast('')).toBe(false);
    });
  });

  describe('isDateToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      expect(isDateToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isDateToday(yesterday)).toBe(false);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isDateToday(tomorrow)).toBe(false);
    });

    it('returns false for null input', () => {
      expect(isDateToday(null)).toBe(false);
    });

    it('returns false for undefined input', () => {
      expect(isDateToday(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isDateToday('')).toBe(false);
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
    it('calculates days correctly for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const days = getDaysUntilDue(futureDate);
      expect(days).toBe(5);
    });

    it('calculates negative days for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      const days = getDaysUntilDue(pastDate);
      expect(days).toBe(-3);
    });

    it('returns null for null input', () => {
      expect(getDaysUntilDue(null)).toBe(null);
    });

    it('returns null for undefined input', () => {
      expect(getDaysUntilDue(undefined)).toBe(null);
    });

    it('returns null for empty string', () => {
      expect(getDaysUntilDue('')).toBe(null);
    });

    it('calculates zero days for today', () => {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setHours(23, 59, 59, 999);
      const days = getDaysUntilDue(dueDate.toISOString());
      expect(days).toBeGreaterThanOrEqual(0);
      expect(days).toBeLessThanOrEqual(1);
    });
  });
});