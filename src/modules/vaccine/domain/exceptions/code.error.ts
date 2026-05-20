import { DomainException } from '@/shared/domain/domain.exception';

export class CodeEmptyError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'CODE_EMPTY';

  constructor() {
    super('Code cannot be empty');
  }
}

export class CodeTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_CODE_TOO_LONG';

  constructor() {
    super('Vaccine Code is too long');
  }
}

export class CodeTooShortError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_CODE_TOO_SHORT';

  constructor() {
    super('Vaccine Code is too short');
  }
}

export class CodeFormatError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_CODE_FORMAT_ERROR';

  constructor() {
    super('Vaccine Code is in an invalid format');
  }
}
