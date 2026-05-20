import {
  ExpDateBeforeOrEqualMfgDateError,
  ExpDateExpiredError,
  ExpDateInvalidError,
  ExpDateRequiredError,
} from '../exceptions/exp-date.error';

interface ExpDateOptions {
  mfgDate?: Date;
  allowExpired?: boolean;
}

export class ExpDate {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(value: Date, options: ExpDateOptions = {}): ExpDate {
    if (!value) throw new ExpDateRequiredError();

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new ExpDateInvalidError();

    if (options.mfgDate) {
      const mfgDate = new Date(options.mfgDate);
      if (!Number.isNaN(mfgDate.getTime()) && date.getTime() <= mfgDate.getTime()) {
        throw new ExpDateBeforeOrEqualMfgDateError();
      }
    }

    if (!options.allowExpired && this.isBeforeToday(date)) {
      throw new ExpDateExpiredError();
    }

    return new ExpDate(date);
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: ExpDate): boolean {
    return this._value.getTime() === other.value.getTime();
  }

  private static isBeforeToday(value: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(value);
    date.setHours(0, 0, 0, 0);

    return date.getTime() < today.getTime();
  }
}
