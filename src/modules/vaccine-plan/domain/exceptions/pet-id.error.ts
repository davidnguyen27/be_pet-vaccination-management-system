import { DomainException } from '@/shared/domain/domain.exception';

export class PetIdRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'PET_ID_REQUIRED';

  constructor() {
    super('Pet ID is required');
  }
}

export class PetIdNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'PET_ID_NOT_FOUND';

  constructor(petId: string) {
    super(`Pet ${petId} not found`);
  }
}
