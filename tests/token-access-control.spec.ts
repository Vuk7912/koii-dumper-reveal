import { describe, it, expect, beforeEach } from 'vitest';
import { TokenAccessControl, UserRole } from '../src/token-access-control';

describe('TokenAccessControl', () => {
  let accessControl: TokenAccessControl;

  beforeEach(() => {
    accessControl = new TokenAccessControl();
  });

  describe('canGenerateTokens', () => {
    it('should not allow token generation for guest role', () => {
      expect(accessControl.canGenerateTokens(UserRole.GUEST)).toBe(false);
    });

    it('should allow token generation for user role within limit', () => {
      expect(accessControl.canGenerateTokens(UserRole.USER, 50)).toBe(true);
    });

    it('should prevent token generation for user role when exceeding limit', () => {
      expect(accessControl.canGenerateTokens(UserRole.USER, 150)).toBe(false);
    });

    it('should allow unlimited token generation for super admin', () => {
      expect(accessControl.canGenerateTokens(UserRole.SUPER_ADMIN, Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('should throw error for invalid role', () => {
      expect(() => accessControl.canGenerateTokens('invalid_role' as UserRole))
        .toThrow('Invalid user role');
    });
  });

  describe('getMaxTokens', () => {
    it('should return correct max tokens for each role', () => {
      expect(accessControl.getMaxTokens(UserRole.GUEST)).toBe(0);
      expect(accessControl.getMaxTokens(UserRole.USER)).toBe(100);
      expect(accessControl.getMaxTokens(UserRole.ADMIN)).toBe(1000);
      expect(accessControl.getMaxTokens(UserRole.SUPER_ADMIN)).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('setRolePermission', () => {
    it('should allow updating permissions for non-guest roles', () => {
      accessControl.setRolePermission(UserRole.USER, {
        role: UserRole.USER,
        canGenerate: true,
        maxTokensPerCycle: 200
      });

      expect(accessControl.getMaxTokens(UserRole.USER)).toBe(200);
    });

    it('should prevent modifying guest role permissions', () => {
      expect(() => 
        accessControl.setRolePermission(UserRole.GUEST, {
          role: UserRole.GUEST,
          canGenerate: true,
          maxTokensPerCycle: 10
        })
      ).toThrow('Cannot modify guest role permissions');
    });
  });
});