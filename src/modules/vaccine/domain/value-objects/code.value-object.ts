import { CodeEmptyError, CodeFormatError, CodeTooLongError, CodeTooShortError } from '../exceptions/code.error';

export class Code {
  private static readonly MIN_LENGTH = 5;
  private static readonly MAX_LENGTH = 30;
  private static readonly FORMAT_REGEX = /^[A-Z0-9]+$/;

  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Code {
    const vaccineCode = value.trim();
    this.validate(vaccineCode);
    return new Code(vaccineCode);
  }

  equals(other: Code): boolean {
    return this._value === other.value;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  private static validate(value: string): void {
    if (!value) throw new CodeEmptyError();
    if (value.length < this.MIN_LENGTH) throw new CodeTooShortError();
    if (value.length > this.MAX_LENGTH) throw new CodeTooLongError();
    if (!this.FORMAT_REGEX.test(value)) throw new CodeFormatError();
  }
}
