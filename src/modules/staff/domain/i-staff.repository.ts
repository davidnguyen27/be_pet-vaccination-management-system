import { employment_status, employment_type } from '@/enums';
import { StaffEntity } from './staff.entity';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';
import { Params } from '@/shared/domain/query-params.type';
export type { PaginatedResult } from '@/shared/domain/paginated-result.type';

export const I_STAFF_REPOSITORY = Symbol('IStaffRepository');

export interface UpdateStaffData {
  userId: string;
  code?: string;
  jobTitle?: string | null;
  department?: string | null;
  employmentType?: employment_type;
  employmentStatus?: employment_status;
  joinDate?: string;
  endDate?: string | null;
  address?: string;
  citizenId?: string;
  notes?: string | null;
}

export interface IStaffRepository {
  findAll(filter: Params): Promise<PaginatedResult<StaffEntity>>;
  findById(id: string): Promise<StaffEntity | null>;
  findByUserId(userId: string): Promise<StaffEntity | null>;
  update(data: UpdateStaffData): Promise<StaffEntity>;
}
