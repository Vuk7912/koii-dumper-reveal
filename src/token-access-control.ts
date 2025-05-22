/**
 * Token Generation Access Control
 * Manages roles, permissions, and access validation for token generation
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface TokenGenerationPermission {
  role: UserRole;
  canGenerate: boolean;
  maxTokensPerCycle: number;
}

export class TokenAccessControl {
  private permissionMap: Map<UserRole, TokenGenerationPermission>;

  constructor() {
    // Define default permission rules
    this.permissionMap = new Map([
      [UserRole.GUEST, { role: UserRole.GUEST, canGenerate: false, maxTokensPerCycle: 0 }],
      [UserRole.USER, { role: UserRole.USER, canGenerate: true, maxTokensPerCycle: 100 }],
      [UserRole.ADMIN, { role: UserRole.ADMIN, canGenerate: true, maxTokensPerCycle: 1000 }],
      [UserRole.SUPER_ADMIN, { role: UserRole.SUPER_ADMIN, canGenerate: true, maxTokensPerCycle: Number.MAX_SAFE_INTEGER }]
    ]);
  }

  /**
   * Check if a user can generate tokens
   * @param role User's role
   * @param currentTokenCount Current number of tokens already generated
   * @returns Boolean indicating if token generation is allowed
   */
  canGenerateTokens(role: UserRole, currentTokenCount: number = 0): boolean {
    const permission = this.permissionMap.get(role);
    
    if (!permission) {
      throw new Error('Invalid user role');
    }

    return permission.canGenerate && 
           currentTokenCount < permission.maxTokensPerCycle;
  }

  /**
   * Get maximum tokens allowed for a specific role
   * @param role User's role
   * @returns Maximum number of tokens allowed
   */
  getMaxTokens(role: UserRole): number {
    const permission = this.permissionMap.get(role);
    
    if (!permission) {
      throw new Error('Invalid user role');
    }

    return permission.maxTokensPerCycle;
  }

  /**
   * Add or update a custom role permission
   * @param role User role to configure
   * @param permission Token generation permission details
   */
  setRolePermission(role: UserRole, permission: TokenGenerationPermission): void {
    if (role === UserRole.GUEST) {
      throw new Error('Cannot modify guest role permissions');
    }
    this.permissionMap.set(role, permission);
  }
}