import { DomainException } from '@/shared/domain/domain.exception';

export class CitizenIdFormatError extends DomainException {
  readonly errorCode = 'VET_CITIZEN_ID_FORMAT_ERROR';
  readonly statusCode = 400;

  constructor() {
    super('Citizen id is invalid format');
  }
}

export class CitizenIdEmptyError extends DomainException {
  readonly errorCode = 'VET_CITIZEN_ID_EMPTY_ERROR';
  readonly statusCode = 400;

  constructor() {
    super('Citizen id is required');
  }
}
