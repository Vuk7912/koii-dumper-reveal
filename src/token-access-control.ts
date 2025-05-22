import { createHash } from 'crypto';

/**
 * Wallet Dumping Verification and Token Generation Access Control
 */
export interface WalletDumpingCriteria {
  minDumpAmount: number;
  minHoldingPeriod: number; // in seconds
  maxDumpFrequency: number; // dumps per time period
  frequencyResetPeriod: number; // period after which frequency count resets
}

export interface WalletVerificationRecord {
  walletAddress: string;
  lastDumpTimestamp: number;
  firstDumpInPeriodTimestamp: number;
  totalDumpAmount: number;
  dumpCount: number;
  verificationNonce: string;
}

export class TokenAccessControl {
  // In-memory storage for wallet verification (in production, use persistent storage)
  private walletRecords: Map<string, WalletVerificationRecord>;
  private dumpingCriteria: WalletDumpingCriteria;

  constructor(criteria?: Partial<WalletDumpingCriteria>) {
    this.walletRecords = new Map();
    this.dumpingCriteria = {
      minDumpAmount: criteria?.minDumpAmount ?? 100, // Default minimum dump amount
      minHoldingPeriod: criteria?.minHoldingPeriod ?? 86400, // Default 24 hours
      maxDumpFrequency: criteria?.maxDumpFrequency ?? 3, // Default max 3 dumps per period
      frequencyResetPeriod: criteria?.frequencyResetPeriod ?? 86400 // Default 24 hours reset period
    };
  }

  /**
   * Generate a cryptographically secure verification nonce
   * @param walletAddress Wallet address to generate nonce for
   * @returns Secure verification nonce
   */
  private generateVerificationNonce(walletAddress: string): string {
    const timestamp = Date.now();
    const randomSalt = Math.random().toString(36).substring(2);
    return createHash('sha256')
      .update(`${walletAddress}:${timestamp}:${randomSalt}`)
      .digest('hex');
  }

  /**
   * Verify wallet eligibility for token generation based on dumping criteria
   * @param walletAddress Wallet address to verify
   * @param dumpAmount Amount of tokens dumped
   * @returns Verification result with eligibility and nonce
   */
  verifyWalletEligibility(
    walletAddress: string, 
    dumpAmount: number
  ): { 
    isEligible: boolean, 
    verificationNonce?: string,
    reason?: string 
  } {
    const currentTime = Date.now() / 1000; // Convert to seconds
    let record = this.walletRecords.get(walletAddress);

    // First-time dumper
    if (!record) {
      if (dumpAmount < this.dumpingCriteria.minDumpAmount) {
        return { 
          isEligible: false, 
          reason: 'Dump amount below minimum threshold' 
        };
      }

      const newRecord: WalletVerificationRecord = {
        walletAddress,
        lastDumpTimestamp: currentTime,
        firstDumpInPeriodTimestamp: currentTime,
        totalDumpAmount: dumpAmount,
        dumpCount: 1,
        verificationNonce: this.generateVerificationNonce(walletAddress)
      };

      this.walletRecords.set(walletAddress, newRecord);

      return { 
        isEligible: true, 
        verificationNonce: newRecord.verificationNonce 
      };
    }

    // Check if frequency reset period has passed
    const timeSincePeriodStart = currentTime - record.firstDumpInPeriodTimestamp;
    if (timeSincePeriodStart >= this.dumpingCriteria.frequencyResetPeriod) {
      // Reset dump count and first dump timestamp
      record.dumpCount = 0;
      record.firstDumpInPeriodTimestamp = currentTime;
    }

    // Check dump frequency
    if (record.dumpCount >= this.dumpingCriteria.maxDumpFrequency) {
      return { 
        isEligible: false, 
        reason: 'Maximum dump frequency exceeded' 
      };
    }

    // Check holding period
    const timeSinceLastDump = currentTime - record.lastDumpTimestamp;
    if (timeSinceLastDump < this.dumpingCriteria.minHoldingPeriod) {
      return { 
        isEligible: false, 
        reason: 'Minimum holding period not met' 
      };
    }

    // Update wallet record
    record.lastDumpTimestamp = currentTime;
    record.totalDumpAmount += dumpAmount;
    record.dumpCount += 1;
    record.verificationNonce = this.generateVerificationNonce(walletAddress);

    this.walletRecords.set(walletAddress, record);

    return { 
      isEligible: true, 
      verificationNonce: record.verificationNonce 
    };
  }

  /**
   * Validate a previously generated verification nonce
   * @param walletAddress Wallet address
   * @param nonce Verification nonce to validate
   * @returns Validation result
   */
  validateVerificationNonce(
    walletAddress: string, 
    nonce: string
  ): boolean {
    const record = this.walletRecords.get(walletAddress);
    
    if (!record) {
      return false;
    }

    // Nonce is valid only once and expires after use
    const isValid = record.verificationNonce === nonce;
    if (isValid) {
      // Invalidate the nonce after successful validation
      record.verificationNonce = '';
      this.walletRecords.set(walletAddress, record);
    }

    return isValid;
  }

  /**
   * Reset wallet dumping record (for testing or administrative purposes)
   * @param walletAddress Wallet address to reset
   */
  resetWalletRecord(walletAddress: string): void {
    this.walletRecords.delete(walletAddress);
  }

  /**
   * Get current dumping criteria
   * @returns Current wallet dumping criteria
   */
  getDumpingCriteria(): WalletDumpingCriteria {
    return { ...this.dumpingCriteria };
  }

  /**
   * Update dumping criteria (with validation)
   * @param newCriteria Partial update to dumping criteria
   */
  updateDumpingCriteria(newCriteria: Partial<WalletDumpingCriteria>): void {
    this.dumpingCriteria = {
      minDumpAmount: newCriteria.minDumpAmount ?? this.dumpingCriteria.minDumpAmount,
      minHoldingPeriod: newCriteria.minHoldingPeriod ?? this.dumpingCriteria.minHoldingPeriod,
      maxDumpFrequency: newCriteria.maxDumpFrequency ?? this.dumpingCriteria.maxDumpFrequency,
      frequencyResetPeriod: newCriteria.frequencyResetPeriod ?? this.dumpingCriteria.frequencyResetPeriod
    };
  }
}