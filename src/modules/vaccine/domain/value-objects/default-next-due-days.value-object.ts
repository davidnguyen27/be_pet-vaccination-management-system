import { DefaultNextDueDaysInvalidError } from '../exceptions/default-next-due-days.error';

export class DefaultNextDueDays {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): DefaultNextDueDays {
    if (!Number.isInteger(value) || value < 0) {
      throw new DefaultNextDueDaysInvalidError();
    }
    return new DefaultNextDueDays(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: DefaultNextDueDays): boolean {
    return this._value === other.value;
  }
}
