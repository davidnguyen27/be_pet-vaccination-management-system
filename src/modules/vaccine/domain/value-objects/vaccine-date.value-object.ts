import { VaccineDateInvalidError } from '../exceptions/date.error';

export class VaccineDate {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(value: Date, field: string): VaccineDate {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new VaccineDateInvalidError(field);
    }
    return new VaccineDate(date);
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: VaccineDate): boolean {
    return this._value.getTime() === other.value.getTime();
  }
}
