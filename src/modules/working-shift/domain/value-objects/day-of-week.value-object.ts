import { DayOfWeekInvalidError } from '../exceptions/day-of-week.error';
import { Weekday } from '../working-shift.types';

export class DayOfWeek {
  private readonly _value: Weekday;

  private constructor(value: Weekday) {
    this._value = value;
  }

  static create(value: Weekday): DayOfWeek {
    if (!Object.values(Weekday).includes(value)) {
      throw new DayOfWeekInvalidError();
    }

    return new DayOfWeek(value);
  }

  get value(): Weekday {
    return this._value;
  }
}
