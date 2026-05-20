export class StaffCode {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value.toUpperCase().trim();
  }

  static create(raw: string): StaffCode {
    if (!this.isValidCode(raw)) {
      throw new Error(`Invalid staff code: ${raw}`);
    }

    return new StaffCode(raw);
  }

  static isValidCode(code: string): boolean {
    return /^[A-Z0-9][A-Z0-9_-]{2,29}$/.test(code.trim().toUpperCase());
  }

  toString(): string {
    return this.value;
  }

  equals(other: StaffCode): boolean {
    return this.value === other.value;
  }
}
