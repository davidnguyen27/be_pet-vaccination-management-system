import { DomainException } from '@/shared/domain/domain.exception';

export class SpeciesNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'SPECIES_NOT_FOUND';

  constructor(id: string) {
    super(`Species with id ${id} not found`);
  }
}

export class SpeciesCodeAlreadyExistsError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'SPECIES_CODE_ALREADY_EXISTS';

  constructor(code: string) {
    super(`Species with code ${code} already exists`);
  }
}

export class SpeciesNameAlreadyExistsError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'SPECIES_NAME_ALREADY_EXISTS';

  constructor(name: string) {
    super(`Species with name ${name} already exists`);
  }
}

export class SpeciesDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'SPECIES_DELETED';

  constructor(id: string) {
    super(`Species ${id} has been deleted`);
  }
}
