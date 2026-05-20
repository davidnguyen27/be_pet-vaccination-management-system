import { LotNoInvalidError, LotNoRequiredError } from '../exceptions/lot-no.error';

export class LotNo {
  private static readonly MAX_LENGTH = 80;
  private static readonly FORMAT_REGEX = /^[A-Z0-9][A-Z0-9/_-]*$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): LotNo {
    const normalizedValue = value?.trim().toUpperCase();
    if (!normalizedValue) throw new LotNoRequiredError();
    if (normalizedValue.length > this.MAX_LENGTH || !this.FORMAT_REGEX.test(normalizedValue)) {
      throw new LotNoInvalidError(normalizedValue);
    }

    return new LotNo(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: LotNo): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
