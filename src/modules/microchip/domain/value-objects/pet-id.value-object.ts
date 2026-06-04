export class PetId {
  private readonly _value: string | null;

  private constructor(value: string | null) {
    this._value = value;
  }

  static create(value: string | null | undefined): PetId {
    const normalizedValue = value?.trim();
    return new PetId(normalizedValue || null);
  }

  get value(): string | null {
    return this._value;
  }

  equals(other: PetId): boolean {
    return this._value === other.value;
  }
}
