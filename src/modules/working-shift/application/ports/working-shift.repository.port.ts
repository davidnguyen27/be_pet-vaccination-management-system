import { Weekday } from '../../domain/working-shift.types';
import { WorkingShiftEntity } from '../../domain/working-shift.entity';

export interface FindWorkingShiftOptions {
  page: number;
  limit: number;
  search?: string;
  vetId?: string;
  dayOfWeek?: Weekday;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export interface WorkingShiftOverlapCriteria {
  vetId: string;
  dayOfWeek: Weekday;
  startTime: Date;
  endTime: Date;
  excludeId?: string;
}

export abstract class WorkingShiftRepositoryPort {
  abstract findById(id: string): Promise<WorkingShiftEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<WorkingShiftEntity>;
  abstract existsVet(vetId: string): Promise<boolean>;
  abstract existsOverlappingShift(criteria: WorkingShiftOverlapCriteria): Promise<boolean>;
  abstract save(workingShift: WorkingShiftEntity): Promise<void>;
}
