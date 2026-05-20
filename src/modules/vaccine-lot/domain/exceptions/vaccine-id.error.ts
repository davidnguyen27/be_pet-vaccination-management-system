import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineIdRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_ID_ERROR';

  constructor() {
    super('Vaccine ID is required');
  }
}

export class VaccineIdNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'VACCINE_ID_NOT_FOUND';

  constructor(vaccineId: string) {
    super(`Vaccine ${vaccineId} not found`);
  }
}

export class VaccineIdInActiveError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_ID_INACTIVE';

  constructor(vaccineId: string) {
    super(`Vaccine ${vaccineId} is inactive`);
  }
}
