import { randomUUID } from 'crypto';

export type VerifyTokenType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

interface VerifyTokenProps {
  userId: string;
  token: string;
  type: VerifyTokenType;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export class VerifyTokenEntity {
  private readonly _id: string;
  private _props: VerifyTokenProps;

  private constructor(id: string, props: VerifyTokenProps) {
    this._id = id;
    this._props = props;
  }

  static create(input: { userId: string; type: VerifyTokenType; ttlMinutes: number }): VerifyTokenEntity {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + input.ttlMinutes);

    return new VerifyTokenEntity(randomUUID(), {
      userId: input.userId,
      token: randomUUID(),
      type: input.type,
      expiresAt,
      usedAt: null,
      createdAt: new Date(),
    });
  }

  static reconstitute(id: string, props: VerifyTokenProps): VerifyTokenEntity {
    return new VerifyTokenEntity(id, props);
  }

  get id() {
    return this._id;
  }
  get userId() {
    return this._props.userId;
  }
  get token() {
    return this._props.token;
  }
  get type() {
    return this._props.type;
  }
  get expiresAt() {
    return this._props.expiresAt;
  }
  get usedAt() {
    return this._props.usedAt;
  }
  get createdAt() {
    return this._props.createdAt;
  }

  get isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  get isUsed(): boolean {
    return this._props.usedAt !== null;
  }

  // Business method
  markAsUsed(): void {
    if (this.isUsed) throw new Error('Token has already been used');
    if (this.isExpired) throw new Error('Token has expired');
    this._props.usedAt = new Date();
  }
}
