import { DomainException } from '@/shared/domain/domain.exception';

export class ShiftNotesTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'SHIFT_NOTES_TOO_LONG';

  constructor() {
    super('Working shift notes must be at most 255 characters');
  }
}
