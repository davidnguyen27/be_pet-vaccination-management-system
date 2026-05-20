import { StaffEntity } from '../../domain/staff.entity';

export interface FindStaffOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class StaffRepositoryPort {
  abstract findByUserIdOrThrow(userId: string): Promise<StaffEntity>;
  abstract findMany(options: FindStaffOptions): Promise<PaginatedResult<StaffEntity>>;
  abstract save(staff: StaffEntity): Promise<void>;
}
