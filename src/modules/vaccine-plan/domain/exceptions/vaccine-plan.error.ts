import { DomainException } from '@/shared/domain/domain.exception';

export class VaccinePlanNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'VACCINE_PLAN_NOT_FOUND';

  constructor(id: string) {
    super(`Vaccine plan with id ${id} not found`);
  }
}

export class VaccinePlanDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'VACCINE_PLAN_DELETED';

  constructor(id: string) {
    super(`Vaccine plan ${id} has been deleted`);
  }
}
