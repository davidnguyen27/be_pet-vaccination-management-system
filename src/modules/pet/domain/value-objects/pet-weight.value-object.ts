export class PetWeight {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error('Weight must be a non-negative number');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}
