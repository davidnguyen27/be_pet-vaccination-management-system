import { ShiftTimeInvalidError, ShiftTimeRangeInvalidError, ShiftTimeRequiredError } from '../exceptions/time.error';

export class ShiftTime {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(value: Date, field: string): ShiftTime {
    if (!value) throw new ShiftTimeRequiredError(field);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new ShiftTimeInvalidError(field);

    const normalized = new Date(0);
    normalized.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

    return new ShiftTime(normalized);
  }

  static ensureValidRange(startTime: ShiftTime, endTime: ShiftTime): void {
    if (startTime._value.getTime() >= endTime._value.getTime()) {
      throw new ShiftTimeRangeInvalidError();
    }
  }

  static durationMinutes(startTime: ShiftTime, endTime: ShiftTime): number {
    return (endTime._value.getTime() - startTime._value.getTime()) / 60_000;
  }

  get value(): Date {
    return new Date(this._value);
  }
}
