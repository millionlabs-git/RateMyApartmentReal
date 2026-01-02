import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signupSchema } from '@shared/schema';
import bcrypt from 'bcrypt';

describe('Signup Validation', () => {
  it('should accept valid signup data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      acceptTerms: true,
    };
    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      acceptTerms: true,
    };
    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject password less than 8 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Pass1!',
      confirmPassword: 'Pass1!',
      acceptTerms: true,
    };
    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject mismatched passwords', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
      acceptTerms: true,
    };
    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject when terms not accepted', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      acceptTerms: false,
    };
    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Password Hashing', () => {
  it('should hash password with bcrypt', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 12);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('should verify hashed password', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare('WrongPassword', hash);
    expect(isValid).toBe(false);
  });
});
