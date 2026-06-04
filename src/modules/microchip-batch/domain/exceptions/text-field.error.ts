import { DomainException } from '@/shared/domain/domain.exception';

export class TextFieldRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'TEXT_FIELD_REQUIRED';

  constructor(field: string) {
    super(`${field} is required`);
  }
}

export class TextFieldTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'TEXT_FIELD_TOO_LONG';

  constructor(field: string, maxLength: number) {
    super(`${field} must be at most ${maxLength} characters`);
  }
}
