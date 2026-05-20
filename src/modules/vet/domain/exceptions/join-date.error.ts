import { DomainException } from '@/shared/domain/domain.exception';

export class JoinDateEmptyError extends DomainException {
  readonly errorCode = 'JOIN_DATE_EMPTY_ERROR';
  readonly statusCode = 400;

  constructor() {
    super('Join date is required');
  }
}

export class JoinDateFormatError extends DomainException {
  readonly errorCode = 'JOIN_DATE_FORMAT_ERROR';
  readonly statusCode = 400;

  constructor(joinDate: string) {
    super(`Join date - ${joinDate} is invalid`);
  }
}
