import { DomainException } from '@/shared/domain/domain.exception';

export class NotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'STAFF_NOT_FOUND';

  constructor(id: string) {
    super(`Staff with id ${id} not found`);
  }
}

export class CodeAlreadyExistsError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'STAFF_CODE_ALREADY_EXISTS';

  constructor(code: string) {
    super(`Staff with code ${code} already exists`);
  }
}

export class CitizenIdAlreadyExistsError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'STAFF_CITIZEN_ID_ALREADY_EXISTS';

  constructor(citizenId: string) {
    super(`Staff with citizen id ${citizenId} already exists`);
  }
}

export class EmploymentAlreadyEndedError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'STAFF_EMPLOYMENT_ALREADY_ENDED';

  constructor(id: string) {
    super(`Staff ${id} employment already ended`);
  }
}

export class InvalidEmploymentDateError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STAFF_INVALID_EMPLOYMENT_DATE';

  constructor(id: string) {
    super(`Staff ${id} has invalid employment dates`);
  }
}
