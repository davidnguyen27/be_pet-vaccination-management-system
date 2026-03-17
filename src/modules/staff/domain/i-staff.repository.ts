import { employment_status, employment_type } from '@/enums';
import { StaffEntity } from './staff.entity';

export const I_STAFF_REPOSITORY = Symbol('IStaffRepository');

export interface GetStaffFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface UpdateStaffData {
  code: string;
  jobTitle?: string | null;
  department?: string | null;
  employmentType: employment_type;
  employmentStatus: employment_status;
  joinDate: string;
  endDate?: string | null;
  address: string;
  citizenId: string;
  notes?: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IStaffRepository {
  findAll(filter: GetStaffFilter): Promise<PaginatedResult<StaffEntity>>;
  findById(id: string): Promise<StaffEntity | null>;
  update(data: UpdateStaffData): Promise<StaffEntity>;
}
