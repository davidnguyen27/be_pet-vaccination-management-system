import { DomainException } from '@/shared/domain/domain.exception';

export class MfgDateRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MFG_DATE_REQUIRED';

  constructor() {
    super('Manufacturing date is required.');
  }
}

export class MfgDateInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MFG_DATE_INVALID';

  constructor() {
    super('Manufacturing date is invalid.');
  }
}

export class MfgDateInFutureError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MFG_DATE_IN_FUTURE';

  constructor() {
    super('Manufacturing date cannot be in the future.');
  }
}

export class MfgDateAfterExpTimeError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MFG_DATE_AFTER_EXP_TIME';

  constructor() {
    super('Manufacturing date must be before expiry time.');
  }
}
