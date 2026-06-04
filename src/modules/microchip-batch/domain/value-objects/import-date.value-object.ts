import { ImportDateInvalidError, ImportDateRequiredError } from '../exceptions/import-date.error';

export class ImportDate {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(value: Date): ImportDate {
    if (!value) throw new ImportDateRequiredError();

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new ImportDateInvalidError();

    return new ImportDate(date);
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: ImportDate): boolean {
    return this._value.getTime() === other.value.getTime();
  }
}
