import { LicenseIssueEmptyError, LicenseIssueFormatError } from '../exceptions/license-issue-by.error';

export class LicenseIssue {
  private static readonly REGEX = /^[A-Za-z]+$/;

  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  static create(value: string): LicenseIssue {
    const licenseIssue = value.trim();
    this.validate(licenseIssue);
    return new LicenseIssue(licenseIssue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: LicenseIssue): boolean {
    return this._value === other.value;
  }

  private static validate(value: string): void {
    if (!value) throw new LicenseIssueEmptyError();
    if (!this.REGEX.test(value)) throw new LicenseIssueFormatError();
  }
}
