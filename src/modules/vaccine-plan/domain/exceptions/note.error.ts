import { DomainException } from '@/shared/domain/domain.exception';

export class NoteTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'VACCINE_PLAN_NOTE_TOO_LONG';

  constructor() {
    super('Vaccine plan note must be at most 255 characters');
  }
}
