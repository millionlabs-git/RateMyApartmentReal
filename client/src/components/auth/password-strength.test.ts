import { describe, it, expect } from 'vitest';
import { getPasswordStrength } from './password-strength';

describe('Password Strength', () => {
  describe('getPasswordStrength', () => {
    it('should return weak for empty password', () => {
      const result = getPasswordStrength('');
      expect(result.level).toBe('weak');
      expect(result.score).toBe(0);
    });

    it('should return weak for short password', () => {
      const result = getPasswordStrength('abc');
      expect(result.level).toBe('weak');
      expect(result.checks.minLength).toBe(false);
    });

    it('should return weak for password with only lowercase', () => {
      const result = getPasswordStrength('abcdefgh');
      expect(result.level).toBe('weak');
      expect(result.score).toBe(2);
      expect(result.checks.minLength).toBe(true);
      expect(result.checks.hasLowercase).toBe(true);
      expect(result.checks.hasUppercase).toBe(false);
    });

    it('should return medium for password with mixed case', () => {
      const result = getPasswordStrength('Abcdefgh');
      expect(result.level).toBe('medium');
      expect(result.score).toBe(3);
      expect(result.checks.hasUppercase).toBe(true);
      expect(result.checks.hasLowercase).toBe(true);
    });

    it('should return strong for password with all requirements', () => {
      const result = getPasswordStrength('Abcdefg1!');
      expect(result.level).toBe('strong');
      expect(result.score).toBe(5);
      expect(result.checks.minLength).toBe(true);
      expect(result.checks.hasUppercase).toBe(true);
      expect(result.checks.hasLowercase).toBe(true);
      expect(result.checks.hasNumber).toBe(true);
      expect(result.checks.hasSpecial).toBe(true);
    });

    it('should detect special characters', () => {
      const result = getPasswordStrength('test@test');
      expect(result.checks.hasSpecial).toBe(true);
    });

    it('should detect numbers', () => {
      const result = getPasswordStrength('test123');
      expect(result.checks.hasNumber).toBe(true);
    });
  });
});
