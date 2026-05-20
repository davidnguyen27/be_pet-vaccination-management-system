import { JoinDateEmptyError, JoinDateFormatError } from '../exceptions/join-date.error';

export class JoinDate {
  private readonly _value: Date;

  constructor(value: Date) {
    if (!value) throw new JoinDateEmptyError();
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new JoinDateFormatError(value.toISOString());
    }

    this._value = value;
  }

  get value(): Date {
    return this._value;
  }
}
