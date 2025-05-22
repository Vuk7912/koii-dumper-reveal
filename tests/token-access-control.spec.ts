import { describe, it, expect, beforeEach } from 'vitest';
import { TokenAccessControl } from '../src/token-access-control';

describe('TokenAccessControl', () => {
  let accessControl: TokenAccessControl;

  beforeEach(() => {
    accessControl = new TokenAccessControl({
      minDumpAmount: 100,
      minHoldingPeriod: 1, // Very short for testing
      maxDumpFrequency: 3,
      frequencyResetPeriod: 10 // Short reset period for testing
    });
  });

  describe('Wallet Verification', () => {
    it('should allow first-time dump meeting minimum criteria', () => {
      const result = accessControl.verifyWalletEligibility('wallet1', 150);
      
      expect(result.isEligible).toBe(true);
      expect(result.verificationNonce).toBeDefined();
    });

    it('should reject dump below minimum amount', () => {
      const result = accessControl.verifyWalletEligibility('wallet1', 50);
      
      expect(result.isEligible).toBe(false);
      expect(result.reason).toBe('Dump amount below minimum threshold');
    });

    it('should allow dump frequency within limit', () => {
      // First three dumps should be allowed
      for (let i = 0; i < 3; i++) {
        const result = accessControl.verifyWalletEligibility('wallet2', 200);
        expect(result.isEligible).toBe(true);
      }

      // Fourth dump should be rejected
      const result = accessControl.verifyWalletEligibility('wallet2', 200);
      
      expect(result.isEligible).toBe(false);
      expect(result.reason).toBe('Maximum dump frequency exceeded');
    });

    it('should validate generated verification nonce', () => {
      const walletAddress = 'wallet3';
      const verificationResult = accessControl.verifyWalletEligibility(walletAddress, 200);
      
      expect(verificationResult.isEligible).toBe(true);
      
      // Validate the nonce
      const isValid = accessControl.validateVerificationNonce(
        walletAddress, 
        verificationResult.verificationNonce!
      );
      
      expect(isValid).toBe(true);

      // Subsequent validation should fail (nonce is single-use)
      const secondValidation = accessControl.validateVerificationNonce(
        walletAddress, 
        verificationResult.verificationNonce!
      );
      
      expect(secondValidation).toBe(false);
    });
  });

  describe('Dumping Criteria Management', () => {
    it('should allow updating dumping criteria', () => {
      const originalCriteria = accessControl.getDumpingCriteria();
      
      accessControl.updateDumpingCriteria({
        minDumpAmount: 200,
        minHoldingPeriod: 172800 // 48 hours
      });

      const updatedCriteria = accessControl.getDumpingCriteria();
      
      expect(updatedCriteria.minDumpAmount).toBe(200);
      expect(updatedCriteria.minHoldingPeriod).toBe(172800);
      expect(updatedCriteria.maxDumpFrequency).toBe(originalCriteria.maxDumpFrequency);
    });

    it('should reset wallet record', () => {
      const walletAddress = 'wallet4';
      
      // First dump
      const firstResult = accessControl.verifyWalletEligibility(walletAddress, 200);
      expect(firstResult.isEligible).toBe(true);

      // Reset record
      accessControl.resetWalletRecord(walletAddress);

      // Should now be eligible again
      const secondResult = accessControl.verifyWalletEligibility(walletAddress, 200);
      expect(secondResult.isEligible).toBe(true);
    });
  });
});