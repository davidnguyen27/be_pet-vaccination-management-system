export class CitizenId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value.trim();
  }

  static create(raw: string): CitizenId {
    if (!this.isValidCitizenId(raw)) {
      throw new Error(`Invalid citizen id: ${raw}`);
    }

    return new CitizenId(raw);
  }

  static isValidCitizenId(citizenId: string): boolean {
    return /^\d{9,12}$/.test(citizenId.trim());
  }

  toString(): string {
    return this.value;
  }

  equals(other: CitizenId): boolean {
    return this.value === other.value;
  }
}
