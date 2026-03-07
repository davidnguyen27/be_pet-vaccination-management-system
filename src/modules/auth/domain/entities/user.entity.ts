import { BaseEntity } from '@/shared/domain/base.entity';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dob?: Date | null;
  isActive: boolean;
  isDeleted: boolean;
  roleId: string;
  roleCode: string;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class UserEntity extends BaseEntity {
  email: string;
  passwordHash: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dob?: Date | null;
  isActive: boolean;
  isDeleted: boolean;
  roleId: string;
  roleCode: string;
  lastLoginAt?: Date | null;

  constructor(props: UserProps) {
    super({ id: props.id, createdAt: props.createdAt, updatedAt: props.updatedAt, deletedAt: props.deletedAt });
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.fullName = props.fullName;
    this.phoneNumber = props.phoneNumber;
    this.avatarUrl = props.avatarUrl;
    this.dob = props.dob;
    this.isActive = props.isActive;
    this.isDeleted = props.isDeleted;
    this.roleId = props.roleId;
    this.roleCode = props.roleCode;
    this.lastLoginAt = props.lastLoginAt;
  }
}
