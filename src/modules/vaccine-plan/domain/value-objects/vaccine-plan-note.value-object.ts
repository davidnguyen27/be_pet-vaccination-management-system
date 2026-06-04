import { NoteTooLongError } from '../exceptions/note.error';

export class VaccinePlanNote {
  private readonly _value: string | null;

  private constructor(value: string | null) {
    this._value = value;
  }

  static create(value: string | null | undefined): VaccinePlanNote {
    const normalizedValue = value?.trim();
    if (!normalizedValue) return new VaccinePlanNote(null);

    if (normalizedValue.length > 255) {
      throw new NoteTooLongError();
    }

    return new VaccinePlanNote(normalizedValue);
  }

  get value(): string | null {
    return this._value;
  }

  equals(other: VaccinePlanNote): boolean {
    return this._value === other.value;
  }
}
