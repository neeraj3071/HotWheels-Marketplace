import jwt from 'jsonwebtoken';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../src/utils/token';
import { UserRole } from '@prisma/client';

describe('Token Utility', () => {
  const testUserId = '123e4567-e89b-12d3-a456-426614174000';
  const testRole: UserRole = 'USER';
  const testTokenId = 'test-token-id';

  describe('signAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = signAccessToken(testUserId, testRole);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId and role in token payload', () => {
      const token = signAccessToken(testUserId, testRole);
      const decoded = jwt.decode(token) as any;
      
      expect(decoded.sub).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    });

    it('should have expiration time set', () => {
      const token = signAccessToken(testUserId, testRole);
      const decoded = jwt.decode(token) as any;
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('signRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = signRefreshToken(testUserId, testRole, testTokenId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include userId, role, and tokenId in payload', () => {
      const token = signRefreshToken(testUserId, testRole, testTokenId);
      const decoded = jwt.decode(token) as any;
      
      expect(decoded.sub).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
      expect(decoded.tokenId).toBe(testTokenId);
    });

    it('should have longer expiration than access token', () => {
      const accessToken = signAccessToken(testUserId, testRole);
      const refreshToken = signRefreshToken(testUserId, testRole, testTokenId);
      
      const accessDecoded = jwt.decode(accessToken) as any;
      const refreshDecoded = jwt.decode(refreshToken) as any;
      
      const accessDuration = accessDecoded.exp - accessDecoded.iat;
      const refreshDuration = refreshDecoded.exp - refreshDecoded.iat;
      
      expect(refreshDuration).toBeGreaterThan(accessDuration);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', () => {
      const token = signAccessToken(testUserId, testRole);
      const payload = verifyAccessToken(token);
      
      expect(payload).toBeDefined();
      expect(payload.sub).toBe(testUserId);
      expect(payload.role).toBe(testRole);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyAccessToken(invalidToken)).toThrow('Invalid or expired access token');
    });

    it('should reject refresh token', () => {
      const refreshToken = signRefreshToken(testUserId, testRole, testTokenId);
      
      expect(() => verifyAccessToken(refreshToken)).toThrow('Invalid or expired access token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const token = signRefreshToken(testUserId, testRole, testTokenId);
      const payload = verifyRefreshToken(token);
      
      expect(payload).toBeDefined();
      expect(payload.sub).toBe(testUserId);
      expect(payload.role).toBe(testRole);
      expect(payload.tokenId).toBe(testTokenId);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyRefreshToken(invalidToken)).toThrow('Invalid or expired refresh token');
    });

    it('should reject access token', () => {
      const accessToken = signAccessToken(testUserId, testRole);
      
      expect(() => verifyRefreshToken(accessToken)).toThrow('Invalid or expired refresh token');
    });
  });
});
