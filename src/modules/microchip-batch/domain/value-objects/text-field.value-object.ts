import { TextFieldRequiredError, TextFieldTooLongError } from '../exceptions/text-field.error';

export class TextField {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string, field: string, maxLength: number): TextField {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new TextFieldRequiredError(field);
    if (normalizedValue.length > maxLength) throw new TextFieldTooLongError(field, maxLength);

    return new TextField(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: TextField): boolean {
    return this._value === other.value;
  }
}
