import { DomainException } from '@/shared/domain/domain.exception';

export class DefaultTotalDosesInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_DEFAULT_TOTAL_DOSES_INVALID';

  constructor() {
    super('Vaccine default total doses must be a positive integer');
  }
}
