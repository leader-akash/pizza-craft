import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  capitalize,
  truncate,
  generateOrderId,
  calculatePercentage,
} from '../format';

describe('formatCurrency', () => {
  it('should format positive numbers as USD currency', () => {
    expect(formatCurrency(10)).toBe('$10.00');
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format negative numbers as USD currency', () => {
    expect(formatCurrency(-10)).toBe('-$10.00');
  });

  it('should handle decimal values correctly', () => {
    expect(formatCurrency(10.99)).toBe('$10.99');
    expect(formatCurrency(10.999)).toBe('$11.00');
  });
});

describe('formatDate', () => {
  it('should format date string to readable format', () => {
    const date = new Date('2024-01-15T10:30:00');
    const formatted = formatDate(date.toISOString());
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });

  it('should include time in the formatted date', () => {
    const date = new Date('2024-01-15T14:30:00');
    const formatted = formatDate(date.toISOString());
    expect(formatted).toMatch(/\d{1,2}:\d{2}/); // Matches time format
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return "Just now" for times less than 60 seconds ago', () => {
    const date = new Date(Date.now() - 30 * 1000);
    expect(formatRelativeTime(date.toISOString())).toBe('Just now');
  });

  it('should format minutes ago correctly', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(date.toISOString())).toBe('5 minutes ago');
    
    const date2 = new Date(Date.now() - 1 * 60 * 1000);
    expect(formatRelativeTime(date2.toISOString())).toBe('1 minute ago');
  });

  it('should format hours ago correctly', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(date.toISOString())).toBe('3 hours ago');
    
    const date2 = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(formatRelativeTime(date2.toISOString())).toBe('1 hour ago');
  });

  it('should format days ago correctly', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(date.toISOString())).toBe('2 days ago');
    
    const date2 = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(date2.toISOString())).toBe('1 day ago');
  });

  it('should return formatted date for dates older than 7 days', () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(date.toISOString());
    expect(result).not.toContain('ago');
    // Should contain a date format (month abbreviation)
    expect(result).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
  });
});

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
    expect(capitalize('pizza')).toBe('Pizza');
  });

  it('should handle already capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('truncate', () => {
  it('should truncate strings longer than maxLength', () => {
    expect(truncate('Hello World', 5)).toBe('He...');
    expect(truncate('This is a long string', 10)).toBe('This is...');
  });

  it('should return original string if length is less than or equal to maxLength', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
    expect(truncate('Hi', 5)).toBe('Hi');
  });

  it('should handle empty strings', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('should handle maxLength less than 3', () => {
    // When maxLength is 2, str.slice(0, maxLength - 3) = str.slice(0, -1)
    // slice(0, -1) returns all but the last character, so "Hello" becomes "Hell"
    // Then '...' is added, resulting in "Hell..."
    const result = truncate('Hello', 2);
    expect(result).toBe('Hell...');
  });
});

describe('generateOrderId', () => {
  it('should generate a unique order ID', () => {
    const id1 = generateOrderId();
    const id2 = generateOrderId();
    
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
    expect(id2).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  it('should generate IDs in uppercase', () => {
    const id = generateOrderId();
    expect(id).toBe(id.toUpperCase());
  });

  it('should start with ORD- prefix', () => {
    const id = generateOrderId();
    expect(id.startsWith('ORD-')).toBe(true);
  });
});

describe('calculatePercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(1, 3)).toBe(33);
  });

  it('should return 0 when total is 0', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
    expect(calculatePercentage(2, 3)).toBe(67);
  });

  it('should handle zero part', () => {
    expect(calculatePercentage(0, 100)).toBe(0);
  });
});

