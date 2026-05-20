import { DoseUnitEmptyError, DoseUnitTooLongError } from '../exceptions/dose-unit.error';

export class DoseUnit {
  private static readonly MAX_LENGTH = 50;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): DoseUnit {
    const unit = value?.trim();
    if (!unit) throw new DoseUnitEmptyError();
    if (unit.length > this.MAX_LENGTH) throw new DoseUnitTooLongError();
    return new DoseUnit(unit);
  }

  get value(): string {
    return this._value;
  }

  equals(other: DoseUnit): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
