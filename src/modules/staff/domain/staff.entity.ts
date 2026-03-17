import { employment_status, employment_type } from '@/enums';
import { UserEntity } from '@/modules/user/domain/user.entity';
import { BaseEntity } from '@/shared/domain/base.entity';

interface StaffProps {
  id: string;
  user: UserEntity;
  code: string;
  jobTitle: string | null;
  department: string | null;
  employmentType: employment_type;
  employmentStatus: employment_status;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class StaffEntity extends BaseEntity {
  user!: UserEntity;
  code!: string;
  jobTitle?: string | null;
  department?: string | null;
  employmentType!: employment_type;
  employmentStatus!: employment_status;
  joinDate!: Date;
  endDate!: Date | null;
  address!: string;
  citizenId!: string;
  notes!: string | null;

  constructor(props: StaffProps) {
    super(props);
    Object.assign(this, props);
  }
}
