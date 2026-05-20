import { DomainException } from '@/shared/domain/domain.exception';

export class DoseValueInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_DOSE_VALUE_INVALID';

  constructor() {
    super('Vaccine dose value must be a positive number');
  }
}
