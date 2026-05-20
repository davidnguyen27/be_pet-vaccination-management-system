import { DomainException } from '@/shared/domain/domain.exception';

export class DefaultNextDueDaysInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_DEFAULT_NEXT_DUE_DAYS_INVALID';

  constructor() {
    super('Vaccine default next due days must be a non-negative integer');
  }
}
