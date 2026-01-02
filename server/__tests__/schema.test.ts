import { describe, it, expect } from 'vitest';
import { users } from '@shared/schema';

describe('Users Schema', () => {
  describe('Table structure', () => {
    it('should have an id column as primary key', () => {
      expect(users.id).toBeDefined();
      expect(users.id.name).toBe('id');
    });

    it('should have an email column (unique, not null)', () => {
      expect(users.email).toBeDefined();
      expect(users.email.name).toBe('email');
      expect(users.email.notNull).toBe(true);
      expect(users.email.isUnique).toBe(true);
    });

    it('should have a password_hash column (not null)', () => {
      expect(users.passwordHash).toBeDefined();
      expect(users.passwordHash.name).toBe('password_hash');
      expect(users.passwordHash.notNull).toBe(true);
    });

    it('should have a role column with default "user"', () => {
      expect(users.role).toBeDefined();
      expect(users.role.name).toBe('role');
      expect(users.role.notNull).toBe(true);
    });

    it('should have a status column with default "active"', () => {
      expect(users.status).toBeDefined();
      expect(users.status.name).toBe('status');
      expect(users.status.notNull).toBe(true);
    });

    it('should have a created_at column', () => {
      expect(users.createdAt).toBeDefined();
      expect(users.createdAt.name).toBe('created_at');
    });
  });
});
