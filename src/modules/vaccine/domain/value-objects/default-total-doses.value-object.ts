import { DefaultTotalDosesInvalidError } from '../exceptions/default-total-doses.error';

export class DefaultTotalDoses {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): DefaultTotalDoses {
    if (!Number.isInteger(value) || value <= 0) {
      throw new DefaultTotalDosesInvalidError();
    }
    return new DefaultTotalDoses(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: DefaultTotalDoses): boolean {
    return this._value === other.value;
  }
}
