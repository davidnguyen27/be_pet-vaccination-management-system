import { employment_status } from '@/enums';
import { UserEntity } from '@/modules/user/domain/user.entity';
import { BaseEntity } from '@/shared/domain/base.entity';

export interface VetProps {
  id: string;
  user: UserEntity;
  bio: string;
  licenseNo: string;
  licenseIssueBy: string;
  licenseValidFrom: Date;
  licenseValidTo: Date;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  employmentStatus: employment_status;
  createdAt: Date;
  updatedAt: Date;
}

export class VetEntity extends BaseEntity {
  user!: UserEntity;
  bio!: string;
  licenseNo!: string;
  licenseIssueBy!: string;
  licenseValidFrom!: Date;
  licenseValidTo!: Date;
  joinDate!: Date;
  endDate!: Date | null;
  address!: string;
  citizenId!: string;
  employmentStatus!: employment_status;

  constructor(props: VetProps) {
    super(props);
    Object.assign(this, props);
  }
}
