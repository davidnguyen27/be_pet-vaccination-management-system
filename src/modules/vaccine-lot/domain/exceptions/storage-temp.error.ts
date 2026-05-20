import { DomainException } from '@/shared/domain/domain.exception';

export class StorageTempMinRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STORAGE_TEMP_MIN_REQUIRED';

  constructor() {
    super('Minimum storage temperature is required');
  }
}

export class StorageTempMaxRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STORAGE_TEMP_MAX_REQUIRED';

  constructor() {
    super('Maximum storage temperature is required');
  }
}

export class StorageTempMinInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STORAGE_TEMP_MIN_INVALID';

  constructor() {
    super('Minimum storage temperature must be a valid number');
  }
}

export class StorageTempMaxInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STORAGE_TEMP_MAX_INVALID';

  constructor() {
    super('Maximum storage temperature must be a valid number');
  }
}

export class StorageTempMinGreaterThanOrEqualMaxError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STORAGE_TEMP_MIN_GREATER_THAN_OR_EQUAL_MAX';

  constructor() {
    super('Minimum storage temperature must be less than maximum storage temperature');
  }
}

export class StorageTempOutOfRangeError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'STORAGE_TEMP_OUT_OF_RANGE';

  constructor() {
    super('Storage temperature is out of allowed range');
  }
}
