import { DomainException } from '@/shared/domain/domain.exception';

export class ImportDateRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'IMPORT_DATE_REQUIRED';

  constructor() {
    super('Import date is required');
  }
}

export class ImportDateInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'IMPORT_DATE_INVALID';

  constructor() {
    super('Import date must be a valid date');
  }
}
