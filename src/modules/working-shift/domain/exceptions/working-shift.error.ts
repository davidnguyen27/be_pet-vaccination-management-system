import { DomainException } from '@/shared/domain/domain.exception';

export class WorkingShiftNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'WORKING_SHIFT_NOT_FOUND';

  constructor(id: string) {
    super(`Working shift with id ${id} not found`);
  }
}

export class WorkingShiftDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'WORKING_SHIFT_DELETED';

  constructor(id: string) {
    super(`Working shift ${id} has been deleted`);
  }
}

export class WorkingShiftOverlapError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'WORKING_SHIFT_OVERLAP';

  constructor() {
    super('Working shift overlaps an existing shift for this veterinarian');
  }
}
