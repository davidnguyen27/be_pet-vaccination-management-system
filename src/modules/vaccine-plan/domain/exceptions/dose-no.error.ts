import { DomainException } from '@/shared/domain/domain.exception';

export class DoseNoInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'DOSE_NO_INVALID';

  constructor() {
    super('Dose number must be a positive integer');
  }
}
