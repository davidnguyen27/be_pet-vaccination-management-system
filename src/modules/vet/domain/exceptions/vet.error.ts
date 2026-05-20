import { DomainException } from '@/shared/domain/domain.exception';

export class VetNotFoundError extends DomainException {
  readonly errorCode = 'VET_NOT_FOUND_ERROR';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`Vet - ${id}  is not found`);
  }
}

export class VetExistsError extends DomainException {
  readonly errorCode = 'VET_EXISTS_ERROR';
  readonly statusCode = 400;

  constructor(id: string) {
    super(`Vet - ${id} is already exists`);
  }
}
