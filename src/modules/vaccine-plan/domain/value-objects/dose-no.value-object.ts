import { DoseNoInvalidError } from '../exceptions/dose-no.error';

export class DoseNo {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): DoseNo {
    if (!Number.isInteger(value) || value <= 0) {
      throw new DoseNoInvalidError();
    }

    return new DoseNo(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: DoseNo): boolean {
    return this._value === other.value;
  }
}
