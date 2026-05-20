import { DomainException } from '@/shared/domain/domain.exception';

export class ExpDateRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'EXP_DATE_REQUIRED';

  constructor() {
    super('Expiration date is required.');
  }
}

export class ExpDateInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'EXP_DATE_INVALID';

  constructor() {
    super('Expiration date must be a valid date.');
  }
}

export class ExpDateBeforeOrEqualMfgDateError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'EXP_DATE_BEFORE_OR_EQUAL_MFG_DATE';

  constructor() {
    super('Expiry date must be after manufacturing date');
  }
}

export class ExpDateExpiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'EXP_DATE_EXPIRED';

  constructor() {
    super('Expiry date has already passed');
  }
}
