import {
  LicenseNoEmptyError,
  LicenseNoFormatError,
  LicenseNoTooLongError,
  LicenseNoTooShortError,
} from '../exceptions/license-no.error';

export class LicenseNo {
  private static readonly MIN_LENGTH = 5;
  private static readonly MAX_LENGTH = 30;
  private static readonly LICENSE_REGEX = /^[A-Z0-9-]+$/;

  private readonly _value: string;

  constructor(value: string) {
    const licenseNoValue = value.trim().toUpperCase();
    this.validate(licenseNoValue);
    this._value = licenseNoValue;
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value) {
      throw new LicenseNoEmptyError();
    }

    if (value.length < LicenseNo.MIN_LENGTH) {
      throw new LicenseNoTooShortError();
    }

    if (value.length > LicenseNo.MAX_LENGTH) {
      throw new LicenseNoTooLongError();
    }

    if (!LicenseNo.LICENSE_REGEX.test(value)) {
      throw new LicenseNoFormatError(value);
    }
  }
}
