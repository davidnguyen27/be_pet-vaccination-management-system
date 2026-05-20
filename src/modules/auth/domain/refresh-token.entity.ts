import { randomUUID } from 'crypto';

interface RefreshTokenProps {
  userId: string;
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export class RefreshTokenEntity {
  private readonly _id: string;
  private _props: RefreshTokenProps;

  private constructor(id: string, props: RefreshTokenProps) {
    this._id = id;
    this._props = props;
  }

  static create(input: { userId: string; ttlDays: number }): RefreshTokenEntity {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + input.ttlDays);

    return new RefreshTokenEntity(randomUUID(), {
      userId: input.userId,
      token: randomUUID(),
      expiresAt,
      revokedAt: null,
      createdAt: new Date(),
    });
  }

  static reconstitute(id: string, props: RefreshTokenProps): RefreshTokenEntity {
    return new RefreshTokenEntity(id, props);
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
  get expiresAt() {
    return this._props.expiresAt;
  }
  get revokedAt() {
    return this._props.revokedAt;
  }
  get createdAt() {
    return this._props.createdAt;
  }

  get isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  get isRevoked(): boolean {
    return this._props.revokedAt !== null;
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isRevoked;
  }

  revoke(): void {
    if (this.isRevoked) throw new Error('Token already revoked');
    this._props.revokedAt = new Date();
  }
}
