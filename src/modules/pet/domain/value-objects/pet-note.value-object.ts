export class PetNote {
  private readonly _value: string | null;

  constructor(value?: string | null) {
    if (value === undefined || value === null) {
      this._value = null;
      return;
    }
    const normalized = value.trim();
    this._value = normalized.length > 0 ? normalized : null;
  }

  get value(): string | null {
    return this._value;
  }
}
