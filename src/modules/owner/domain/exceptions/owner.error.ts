import { DomainException } from '@/shared/domain/domain.exception';

export class OwnerNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'OWNER_NOT_FOUND';

  constructor(id: string) {
    super(`Owner with id ${id} not found`);
  }
}

export class OwnerDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'OWNER_DELETED';

  constructor(id: string) {
    super(`Owner ${id} has been deleted`);
  }
}
