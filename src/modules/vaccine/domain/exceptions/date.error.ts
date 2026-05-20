import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineDateInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_DATE_INVALID';

  constructor(field: string) {
    super(`${field} must be a valid date`);
  }
}
