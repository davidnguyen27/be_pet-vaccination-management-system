import { MicrochipCodeRequiredError, MicrochipCodeTooLongError } from '../exceptions/microchip-code.error';

export class MicrochipCode {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): MicrochipCode {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new MicrochipCodeRequiredError();
    if (normalizedValue.length > 50) throw new MicrochipCodeTooLongError();

    return new MicrochipCode(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: MicrochipCode): boolean {
    return this._value === other.value;
  }
}
