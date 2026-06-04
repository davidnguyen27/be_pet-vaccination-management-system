import { DomainException } from '@/shared/domain/domain.exception';

export class ShiftTimeRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'SHIFT_TIME_REQUIRED';

  constructor(field: string) {
    super(`${field} is required`);
  }
}

export class ShiftTimeInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'SHIFT_TIME_INVALID';

  constructor(field: string) {
    super(`${field} must be a valid time`);
  }
}

export class ShiftTimeRangeInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'SHIFT_TIME_RANGE_INVALID';

  constructor() {
    super('End time must be after start time');
  }
}
