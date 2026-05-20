import { CitizenIdEmptyError, CitizenIdFormatError } from '../exceptions/citizen-id.error';

export class CitizenId {
  private static readonly CITIZEN_ID_REGEX = /^(\d{9}|\d{12})$/;

  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static create(value: string): CitizenId {
    const citizenId = value.trim();
    this.validate(citizenId);
    return new CitizenId(citizenId);
  }

  get value(): string {
    return this._value;
  }

  equals(other: CitizenId): boolean {
    return this._value === other.value;
  }

  private static validate(value: string): void {
    if (!value) throw new CitizenIdEmptyError();
    if (!this.CITIZEN_ID_REGEX.test(value)) throw new CitizenIdFormatError();
  }
}
