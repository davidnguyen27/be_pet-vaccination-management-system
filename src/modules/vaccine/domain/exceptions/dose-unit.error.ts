import { DomainException } from '@/shared/domain/domain.exception';

export class DoseUnitEmptyError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_DOSE_UNIT_EMPTY';

  constructor() {
    super('Vaccine dose unit cannot be empty');
  }
}

export class DoseUnitTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_DOSE_UNIT_TOO_LONG';

  constructor() {
    super('Vaccine dose unit is too long');
  }
}
