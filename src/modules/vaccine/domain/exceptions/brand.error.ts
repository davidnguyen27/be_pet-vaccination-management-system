import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineBrandEmptyError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_BRAND_EMPTY';

  constructor() {
    super('Vaccine brand cannot be empty');
  }
}

export class VaccineBrandTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_BRAND_TOO_LONG';

  constructor() {
    super('Vaccine brand is too long');
  }
}
