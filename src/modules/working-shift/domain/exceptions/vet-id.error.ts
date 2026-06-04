import { DomainException } from '@/shared/domain/domain.exception';

export class VetIdRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VET_ID_REQUIRED';

  constructor() {
    super('Veterinarian ID is required');
  }
}

export class VetIdNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'VET_ID_NOT_FOUND';

  constructor(vetId: string) {
    super(`Veterinarian ${vetId} not found`);
  }
}
