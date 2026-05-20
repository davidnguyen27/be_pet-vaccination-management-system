import { StaffModel } from '../model/staff.model';
import { FindStaffOptions, PaginatedResult } from './staff.repository.port';

export abstract class StaffQueryPort {
  abstract findByUserId(userId: string): Promise<StaffModel>;
  abstract findMany(options: FindStaffOptions): Promise<PaginatedResult<StaffModel>>;
}
