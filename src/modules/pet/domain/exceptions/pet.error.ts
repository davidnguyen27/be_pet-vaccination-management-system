import { DomainException } from '@/shared/domain/domain.exception';

export class PetNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'PET_NOT_FOUND';

  constructor(id: string) {
    super(`Pet - ${id} is not found`);
  }
}

export class PetDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'PET_DELETED';

  constructor(id: string) {
    super(`Pet - ${id} has been deleted`);
  }
}
