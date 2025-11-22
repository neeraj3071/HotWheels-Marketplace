import { hashPassword, verifyPassword } from '../../src/utils/password';

describe('Password Utility', () => {
  const testPassword = 'SecurePassword123!';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword(testPassword);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(testPassword);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hashes are long
    });

    it('should create different hashes for same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      
      expect(hash1).not.toBe(hash2); // Due to salt
    });

    it('should handle empty password', async () => {
      const hash = await hashPassword('');
      expect(hash).toBeDefined();
    });
  });

  describe('verifyPassword', () => {
    let hashedPassword: string;

    beforeAll(async () => {
      hashedPassword = await hashPassword(testPassword);
    });

    it('should verify correct password', async () => {
      const isValid = await verifyPassword(testPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const isValid = await verifyPassword('WrongPassword', hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const isValid = await verifyPassword('securepassword123!', hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should handle empty password verification', async () => {
      const isValid = await verifyPassword('', hashedPassword);
      expect(isValid).toBe(false);
    });
  });
});
