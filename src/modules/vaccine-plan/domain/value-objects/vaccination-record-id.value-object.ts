export class VaccinationRecordId {
  private readonly _value: string | null;

  private constructor(value: string | null) {
    this._value = value;
  }

  static create(value: string | null | undefined): VaccinationRecordId {
    const normalizedValue = value?.trim();
    return new VaccinationRecordId(normalizedValue || null);
  }

  get value(): string | null {
    return this._value;
  }

  equals(other: VaccinationRecordId): boolean {
    return this._value === other.value;
  }
}
