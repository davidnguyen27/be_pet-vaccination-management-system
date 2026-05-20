import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineNameEmptyError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_NAME_EMPTY';

  constructor() {
    super('Vaccine name cannot be empty');
  }
}

export class VaccineNameTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_NAME_TOO_LONG';

  constructor() {
    super('Vaccine name is too long');
  }
}
