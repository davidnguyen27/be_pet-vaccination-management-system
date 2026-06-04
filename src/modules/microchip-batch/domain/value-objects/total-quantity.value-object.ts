import { TotalQuantityInvalidError } from '../exceptions/total-quantity.error';

export class TotalQuantity {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): TotalQuantity {
    if (!Number.isInteger(value) || value < 0) {
      throw new TotalQuantityInvalidError();
    }

    return new TotalQuantity(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: TotalQuantity): boolean {
    return this._value === other.value;
  }
}
