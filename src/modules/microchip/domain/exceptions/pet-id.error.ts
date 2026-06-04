import { DomainException } from '@/shared/domain/domain.exception';

export class PetIdNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'PET_ID_NOT_FOUND';

  constructor(petId: string) {
    super(`Pet ${petId} not found`);
  }
}
