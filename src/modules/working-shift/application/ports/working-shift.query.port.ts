import { WorkingShiftModel } from '../model/working-shift.model';
import { FindWorkingShiftOptions, PaginatedResult } from './working-shift.repository.port';

export abstract class WorkingShiftQueryPort {
  abstract findById(id: string): Promise<WorkingShiftModel>;
  abstract findMany(options: FindWorkingShiftOptions): Promise<PaginatedResult<WorkingShiftModel>>;
}
