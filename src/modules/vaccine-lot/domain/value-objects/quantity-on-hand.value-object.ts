import {
  QuantityOnHandExceedsInitialQuantityError,
  QuantityOnHandInsufficientError,
  QuantityOnHandInvalidError,
  QuantityOnHandNegativeError,
  QuantityOnHandRequiredError,
} from '../exceptions/quantity-onhand.error';

export class QuantityOnHand {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number, initialQuantity?: number): QuantityOnHand {
    if (value === null || value === undefined) throw new QuantityOnHandRequiredError();
    if (!Number.isInteger(value)) throw new QuantityOnHandInvalidError();
    if (value < 0) throw new QuantityOnHandNegativeError();
    if (initialQuantity !== undefined && value > initialQuantity) {
      throw new QuantityOnHandExceedsInitialQuantityError();
    }

    return new QuantityOnHand(value);
  }

  ensureSufficient(requiredQuantity: number): void {
    if (!Number.isInteger(requiredQuantity) || requiredQuantity < 0) {
      throw new QuantityOnHandInvalidError();
    }

    if (this._value < requiredQuantity) {
      throw new QuantityOnHandInsufficientError();
    }
  }

  get value(): number {
    return this._value;
  }

  equals(other: QuantityOnHand): boolean {
    return this._value === other.value;
  }
}
