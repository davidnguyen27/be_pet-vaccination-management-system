import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineStatusInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_STATUS_INVALID';

  constructor() {
    super('Vaccine status is invalid');
  }
}
