import { DoseValueInvalidError } from '../exceptions/dose-value.error';

export class DoseValue {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): DoseValue {
    if (!Number.isFinite(value) || value <= 0) {
      throw new DoseValueInvalidError();
    }
    return new DoseValue(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: DoseValue): boolean {
    return this._value === other.value;
  }
}
