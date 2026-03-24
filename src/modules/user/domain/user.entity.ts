import { OwnerEntity } from '@/modules/owner/domain/owner.entity';
import { StaffEntity } from '@/modules/staff/domain/staff.entity';
import { VetEntity } from '@/modules/vet/domain/vet.entity';
import { BaseEntity } from '@/shared/domain/base.entity';

interface UserProps {
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
  owner?: OwnerEntity | null;
  vet?: VetEntity | null;
  staff?: StaffEntity | null;
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
  roleCode!: string;
  lastLoginAt?: Date | null;
  owner?: OwnerEntity | null;
  vet?: VetEntity | null;
  staff?: StaffEntity | null;

  constructor(props: UserProps) {
    super(props);
    Object.assign(this, props);
  }
}
