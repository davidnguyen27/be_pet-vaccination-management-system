import { VaccineNameEmptyError, VaccineNameTooLongError } from '../exceptions/name.error';

export class VaccineName {
  private static readonly MAX_LENGTH = 255;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VaccineName {
    const name = value?.trim();
    if (!name) throw new VaccineNameEmptyError();
    if (name.length > this.MAX_LENGTH) throw new VaccineNameTooLongError();
    return new VaccineName(name);
  }

  get value(): string {
    return this._value;
  }

  equals(other: VaccineName): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
