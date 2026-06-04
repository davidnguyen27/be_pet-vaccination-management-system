import { PlanDateInvalidError, PlanDateRangeInvalidError, PlanDateRequiredError } from '../exceptions/date.error';

export class PlanDate {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(value: Date, field = 'Date'): PlanDate {
    if (!value) throw new PlanDateRequiredError(field);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new PlanDateInvalidError(field);

    return new PlanDate(date);
  }

  static createOptional(value: Date | null | undefined, field = 'Date'): PlanDate | null {
    if (value === null || value === undefined) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new PlanDateInvalidError(field);

    return new PlanDate(date);
  }

  static ensureWindow(dueDate: Date, dueFrom: Date | null, dueTo: Date | null): void {
    const dueDateTime = PlanDate.toDateOnlyTime(dueDate);
    const dueFromTime = dueFrom ? PlanDate.toDateOnlyTime(dueFrom) : null;
    const dueToTime = dueTo ? PlanDate.toDateOnlyTime(dueTo) : null;

    if (dueFromTime !== null && dueToTime !== null && dueFromTime > dueToTime) {
      throw new PlanDateRangeInvalidError();
    }

    if (dueFromTime !== null && dueFromTime > dueDateTime) {
      throw new PlanDateRangeInvalidError();
    }

    if (dueToTime !== null && dueToTime < dueDateTime) {
      throw new PlanDateRangeInvalidError();
    }
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: PlanDate): boolean {
    return this._value.getTime() === other.value.getTime();
  }

  private static toDateOnlyTime(value: Date): number {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }
}
