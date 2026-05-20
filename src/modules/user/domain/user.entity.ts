import { Email } from './value-objects/email.value-object';
import { Password } from './value-objects/password.value-object';
import { PhoneNumber } from './value-objects/phone-number.value-object';

interface UserProps {
  roleId: string;
  roleCode: string;
  email: Email;
  password: Password;
  fullName: string | null;
  phoneNumber: PhoneNumber | null;
  avatarUrl: string | null;
  dob: Date | null;
  isActive: boolean;
  isDeleted: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class UserEntity {
  private readonly _id: string;
  private _props: UserProps;

  private constructor(id: string, props: UserProps) {
    this._id = id;
    this._props = props;
  }

  // Factory method
  static create(
    id: string,
    input: {
      roleCode: string;
      email: string;
      password: string;
      fullName?: string | null;
      phoneNumber?: string | null;
      avatarUrl?: string | null;
      dob?: Date | null;
    },
  ): UserEntity {
    return new UserEntity(id, {
      roleId: '',
      roleCode: input.roleCode,
      email: Email.create(input.email),
      password: Password.createRaw(input.password),
      fullName: input.fullName?.trim() ?? null,
      phoneNumber: input.phoneNumber ? PhoneNumber.create(input.phoneNumber) : null,
      avatarUrl: input.avatarUrl ?? null,
      dob: input.dob ?? null,
      isActive: false,
      isDeleted: false,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  // Reconstitute from DB
  static reconstitute(id: string, props: UserProps): UserEntity {
    return new UserEntity(id, props);
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get roleId(): string {
    return this._props.roleId;
  }
  get roleCode(): string {
    return this._props.roleCode;
  }
  get email(): string {
    return this._props.email.toString();
  }
  get password(): Password {
    return this._props.password;
  }
  get fullName(): string | null {
    return this._props.fullName;
  }
  get phoneNumber(): string | null {
    return this._props.phoneNumber?.toString() ?? null;
  }
  get avatarUrl(): string | null {
    return this._props.avatarUrl;
  }
  get dob(): Date | null {
    return this._props.dob;
  }
  get isActive(): boolean {
    return this._props.isActive;
  }
  get isDeleted(): boolean {
    return this._props.isDeleted;
  }
  get lastLoginAt(): Date | null {
    return this._props.lastLoginAt;
  }
  get createdAt(): Date {
    return this._props.createdAt;
  }
  get updatedAt(): Date {
    return this._props.updatedAt;
  }
  get deletedAt(): Date | null {
    return this._props.deletedAt;
  }

  // Business methods
  updatePassword(hashedPassword: Password): void {
    if (!hashedPassword.isHashed()) {
      throw new Error('Password must be hashed before updating');
    }
    this._props.password = hashedPassword;
    this._props.updatedAt = new Date();
  }

  activate(): void {
    if (this._props.isActive) {
      throw new Error('User is already active');
    }
    this._props.isActive = true;
    this._props.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this._props.isActive) {
      throw new Error('User is already inactive');
    }
    this._props.isActive = false;
    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new Error('User is already deleted');
    }
    this._props.isDeleted = true;
    this._props.isActive = false;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }

  updateProfile(input: {
    fullName?: string | null;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    dob?: Date | null;
  }): void {
    if (input.fullName !== undefined) {
      this._props.fullName = input.fullName?.trim() ?? null;
    }
    if (input.phoneNumber !== undefined) {
      this._props.phoneNumber = input.phoneNumber ? PhoneNumber.create(input.phoneNumber) : null;
    }
    if (input.avatarUrl !== undefined) {
      this._props.avatarUrl = input.avatarUrl ?? null;
    }
    if (input.dob !== undefined) {
      this._props.dob = input.dob ?? null;
    }
    this._props.updatedAt = new Date();
  }

  recordLogin(): void {
    this._props.lastLoginAt = new Date();
    this._props.updatedAt = new Date();
  }
}
