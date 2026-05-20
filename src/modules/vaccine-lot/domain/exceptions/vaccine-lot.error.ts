import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineLotNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'VACCINE_LOT_NOT_FOUND';

  constructor(id: string) {
    super(`Vaccine lot with id ${id} not found`);
  }
}

export class VaccineLotDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'VACCINE_LOT_DELETED';

  constructor(id: string) {
    super(`Vaccine lot ${id} has been deleted`);
  }
}
