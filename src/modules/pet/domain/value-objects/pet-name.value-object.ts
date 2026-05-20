export class PetName {
  private readonly _value: string;

  constructor(value: string) {
    const normalizedValue = value.trim();
    if (!normalizedValue) throw new Error('Pet name is required');
    this._value = normalizedValue;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
