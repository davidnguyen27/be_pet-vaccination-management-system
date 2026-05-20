import { VaccineBrandEmptyError, VaccineBrandTooLongError } from '../exceptions/brand.error';

export class VaccineBrand {
  private static readonly MAX_LENGTH = 255;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VaccineBrand {
    const brand = value?.trim();
    if (!brand) throw new VaccineBrandEmptyError();
    if (brand.length > this.MAX_LENGTH) throw new VaccineBrandTooLongError();
    return new VaccineBrand(brand);
  }

  get value(): string {
    return this._value;
  }

  equals(other: VaccineBrand): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
