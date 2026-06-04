import { DomainException } from '@/shared/domain/domain.exception';

export class SlotDurationInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'SLOT_DURATION_INVALID';

  constructor() {
    super('Slot duration must be a positive integer');
  }
}

export class SlotDurationExceedsShiftError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'SLOT_DURATION_EXCEEDS_SHIFT';

  constructor() {
    super('Slot duration cannot exceed the working shift duration');
  }
}

export class MaxAppointmentsInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MAX_APPOINTMENTS_INVALID';

  constructor() {
    super('Maximum appointments must be a positive integer');
  }
}
