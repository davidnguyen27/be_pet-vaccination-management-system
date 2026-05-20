import {
  MfgDateAfterExpTimeError,
  MfgDateInFutureError,
  MfgDateInvalidError,
  MfgDateRequiredError,
} from '../exceptions/mfgDate.error';

interface MfgDateOptions {
  expDate?: Date;
  allowFuture?: boolean;
}

export class MfgDate {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(value: Date, options: MfgDateOptions = {}): MfgDate {
    if (!value) throw new MfgDateRequiredError();

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new MfgDateInvalidError();

    if (!options.allowFuture && date.getTime() > Date.now()) {
      throw new MfgDateInFutureError();
    }

    if (options.expDate) {
      const expDate = new Date(options.expDate);
      if (!Number.isNaN(expDate.getTime()) && date.getTime() >= expDate.getTime()) {
        throw new MfgDateAfterExpTimeError();
      }
    }

    return new MfgDate(date);
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: MfgDate): boolean {
    return this._value.getTime() === other.value.getTime();
  }
}
