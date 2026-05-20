import { AUTH_CONSTANTS } from '@/constants/auth';
import * as bcrypt from 'bcrypt';

export class Password {
  private readonly value: string;
  private readonly hashed: boolean;

  private constructor(value: string, hashed: boolean = false) {
    this.value = value;
    this.hashed = hashed;
  }

  static createRaw(raw: string): Password {
    if (!raw || raw.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(raw)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(raw)) {
      throw new Error('Password must contain at least one number');
    }
    return new Password(raw, false);
  }

  static fromHashed(hashed: string): Password {
    return new Password(hashed, true);
  }

  isHashed(): boolean {
    return this.hashed;
  }

  async hash(): Promise<Password> {
    if (this.hashed) return this;
    const hashedValue = await bcrypt.hash(this.value, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    return new Password(hashedValue, true);
  }

  async compare(plainText: string): Promise<boolean> {
    if (!this.hashed) {
      throw new Error('Cannot compare: password is not hashed');
    }
    return bcrypt.compare(plainText, this.value);
  }

  toString(): string {
    return this.value;
  }
}
