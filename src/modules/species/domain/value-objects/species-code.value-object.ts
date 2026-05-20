export class SpeciesCode {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value.toUpperCase().trim();
  }

  static create(raw: string): SpeciesCode {
    if (!this.isValidCode(raw)) {
      throw new Error(`Invalid species code: ${raw}`);
    }
    return new SpeciesCode(raw);
  }

  static isValidCode(code: string): boolean {
    return /^[A-Z0-9]{3,10}$/.test(code.trim());
  }

  toString(): string {
    return this.value;
  }
}
