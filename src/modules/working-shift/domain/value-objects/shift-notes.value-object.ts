import { ShiftNotesTooLongError } from '../exceptions/notes.error';

export class ShiftNotes {
  private readonly _value: string | null;

  private constructor(value: string | null) {
    this._value = value;
  }

  static create(value: string | null | undefined): ShiftNotes {
    const normalizedValue = value?.trim();
    if (!normalizedValue) return new ShiftNotes(null);
    if (normalizedValue.length > 255) throw new ShiftNotesTooLongError();

    return new ShiftNotes(normalizedValue);
  }

  get value(): string | null {
    return this._value;
  }
}
