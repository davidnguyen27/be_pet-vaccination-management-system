import { DomainException } from '@/shared/domain/domain.exception';

export class PlanDateRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'PLAN_DATE_REQUIRED';

  constructor(field: string) {
    super(`${field} is required`);
  }
}

export class PlanDateInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'PLAN_DATE_INVALID';

  constructor(field: string) {
    super(`${field} must be a valid date`);
  }
}

export class PlanDateRangeInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'PLAN_DATE_RANGE_INVALID';

  constructor() {
    super('Due date range is invalid');
  }
}
