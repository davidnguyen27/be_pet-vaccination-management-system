import { DomainException } from '@/shared/domain/domain.exception';

export class LicenseIssueEmptyError extends DomainException {
  readonly errorCode = 'VET_LICENSE_ISSUE_BY_EMPTY_ERROR';
  readonly statusCode = 400;

  constructor() {
    super('License issuer is required');
  }
}

export class LicenseIssueFormatError extends DomainException {
  readonly errorCode = 'VET_LICENSE_ISSUE_BY_FORMAT_ERROR';
  readonly statusCode = 400;

  constructor() {
    super('License issuer is invalid format');
  }
}
