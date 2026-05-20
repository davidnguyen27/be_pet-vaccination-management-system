import { DomainException } from '@/shared/domain/domain.exception';

export class UserNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'USER_NOT_FOUND';

  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}

export class UserEmailAlreadyExistsError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'USER_EMAIL_ALREADY_EXISTS';

  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class UserDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'USER_DELETED';

  constructor(id: string) {
    super(`User ${id} has been deleted`);
  }
}
