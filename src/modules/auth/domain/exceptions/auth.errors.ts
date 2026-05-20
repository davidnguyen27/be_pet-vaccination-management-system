import { DomainException } from '@/shared/domain/domain.exception';

export class TokenExpiredError extends DomainException {
  readonly statusCode = 401;
  readonly errorCode = 'TOKEN_EXPIRED';

  constructor() {
    super('Token has expired');
  }
}

export class TokenInvalidError extends DomainException {
  readonly statusCode = 401;
  readonly errorCode = 'TOKEN_INVALID';

  constructor() {
    super('Token is invalid');
  }
}

export class TokenAlreadyUsedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'TOKEN_ALREADY_USED';
  constructor() {
    super('Token has already been used');
  }
}

export class TokenNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'TOKEN_NOT_FOUND';
  constructor() {
    super('Token not found');
  }
}

export class EmailNotVerifiedError extends DomainException {
  readonly statusCode = 403;
  readonly errorCode = 'EMAIL_NOT_VERIFIED';
  constructor() {
    super('Please verify your email before logging in');
  }
}

export class AccountInactiveError extends DomainException {
  readonly statusCode = 403;
  readonly errorCode = 'ACCOUNT_INACTIVE';
  constructor() {
    super('Your account has been deactivated');
  }
}
