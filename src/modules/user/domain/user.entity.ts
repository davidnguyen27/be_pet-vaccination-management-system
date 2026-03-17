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
  roleCode: string;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class UserEntity extends BaseEntity {
  email!: string;
  passwordHash!: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dob?: Date | null;
  isActive!: boolean;
  isDeleted!: boolean;
  roleCode!: string;
  lastLoginAt?: Date | null;

  constructor(props: UserProps) {
    super(props);
    Object.assign(this, props);
  }
}
