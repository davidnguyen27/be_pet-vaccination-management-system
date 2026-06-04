import { TextFieldTooLongError } from '../exceptions/text-field.error';

export class BatchNotes {
  private readonly _value: string | null;

  private constructor(value: string | null) {
    this._value = value;
  }

  static create(value: string | null | undefined): BatchNotes {
    const normalizedValue = value?.trim();
    if (!normalizedValue) return new BatchNotes(null);
    if (normalizedValue.length > 255) throw new TextFieldTooLongError('Notes', 255);

    return new BatchNotes(normalizedValue);
  }

  get value(): string | null {
    return this._value;
  }

  equals(other: BatchNotes): boolean {
    return this._value === other.value;
  }
}
