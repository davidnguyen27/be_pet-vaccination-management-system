import {
  MaxAppointmentsInvalidError,
  SlotDurationExceedsShiftError,
  SlotDurationInvalidError,
} from '../exceptions/capacity.error';

export class SlotDuration {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number, shiftDurationMinutes: number): SlotDuration {
    if (!Number.isInteger(value) || value <= 0) {
      throw new SlotDurationInvalidError();
    }

    if (value > shiftDurationMinutes) {
      throw new SlotDurationExceedsShiftError();
    }

    return new SlotDuration(value);
  }

  get value(): number {
    return this._value;
  }
}

export class MaxAppointments {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): MaxAppointments {
    if (!Number.isInteger(value) || value <= 0) {
      throw new MaxAppointmentsInvalidError();
    }

    return new MaxAppointments(value);
  }

  get value(): number {
    return this._value;
  }
}
