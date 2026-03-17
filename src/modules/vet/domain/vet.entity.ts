import { employment_status } from '@/enums';
import { UserEntity } from '@/modules/user/domain/user.entity';

interface VetProps {
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

export class VetEntity {
  id!: string;
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
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: VetProps) {
    Object.assign(this, props);
  }
}
