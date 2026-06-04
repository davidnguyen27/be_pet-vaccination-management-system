import { DomainException } from '@/shared/domain/domain.exception';

export class VaccinePlanStatusInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_PLAN_STATUS_INVALID';

  constructor() {
    super('Vaccine plan status is invalid');
  }
}
