import {
  InitialQuantityInvalidError,
  InitialQuantityLessThanQuantityOnHandError,
  InitialQuantityMustBePositiveError,
  InitialQuantityRequiredError,
} from '../exceptions/initial-quantity.error';

export class InitialQuantity {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number, quantityOnHand?: number): InitialQuantity {
    if (value === null || value === undefined) throw new InitialQuantityRequiredError();
    if (!Number.isInteger(value)) throw new InitialQuantityInvalidError();
    if (value <= 0) throw new InitialQuantityMustBePositiveError();
    if (quantityOnHand !== undefined && value < quantityOnHand) {
      throw new InitialQuantityLessThanQuantityOnHandError();
    }

    return new InitialQuantity(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: InitialQuantity): boolean {
    return this._value === other.value;
  }
}
