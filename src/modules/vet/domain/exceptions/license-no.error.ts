import { DomainException } from '@/shared/domain/domain.exception';

export class LicenseNoNotFoundError extends DomainException {
  readonly errorCode = 'LICENSE_NO_NOT_FOUND_ERROR';
  readonly statusCode = 404;

  constructor(licenseNo: string) {
    super(`License no - ${licenseNo} is not found`);
  }
}

export class LicenseNoEmptyError extends DomainException {
  readonly errorCode = 'LICENSE_NO_EMPTY_ERROR';
  readonly statusCode = 400;

  constructor() {
    super('License no is required');
  }
}

export class LicenseNoFormatError extends DomainException {
  readonly errorCode = 'LICENSE_NO_FORMAT_ERROR';
  readonly statusCode = 400;

  constructor(licenseNo: string) {
    super(`License number - ${licenseNo} is invalid`);
  }
}

export class LicenseNoTooShortError extends DomainException {
  readonly errorCode = 'LICENSE_NO_TOO_SHORT_ERROR';
  readonly statusCode = 400;

  constructor() {
    super(`License number must be at least 5 characters long`);
  }
}

export class LicenseNoTooLongError extends DomainException {
  readonly errorCode = 'LICENSE_NO_TOO_LONG_ERROR';
  readonly statusCode = 400;

  constructor() {
    super(`License number must be at most 30 characters long`);
  }
}
