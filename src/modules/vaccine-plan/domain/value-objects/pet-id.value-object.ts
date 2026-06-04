import { PetIdRequiredError } from '../exceptions/pet-id.error';

export class PetId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PetId {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new PetIdRequiredError();

    return new PetId(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PetId): boolean {
    return this._value === other.value;
  }
}
