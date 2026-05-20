import { DomainException } from '@/shared/domain/domain.exception';

export class VaccineNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'VACCINE_NOT_FOUND';

  constructor(id: string) {
    super(`Vaccine with id ${id} not found`);
  }
}

export class VaccineDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'VACCINE_DELETED';

  constructor(id: string) {
    super(`Vaccine ${id} has been deleted`);
  }
}
