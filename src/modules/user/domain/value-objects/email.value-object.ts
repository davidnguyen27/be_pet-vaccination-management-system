export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value.toLowerCase().trim();
  }

  static create(raw: string): Email {
    if (!this.isValidEmail(raw)) {
      throw new Error(`Invalid email address: ${raw}`);
    }
    return new Email(raw);
  }

  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
