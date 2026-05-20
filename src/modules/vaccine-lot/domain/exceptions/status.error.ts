import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineLotStatusInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_LOT_STATUS_INVALID';

  constructor() {
    super('Vaccine lot status is invalid');
  }
}
