import { VaccineIdRequiredError } from '../exceptions/vaccine-id.error';

export class VaccineId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VaccineId {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new VaccineIdRequiredError();

    return new VaccineId(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: VaccineId): boolean {
    return this._value === other.value;
  }
}
