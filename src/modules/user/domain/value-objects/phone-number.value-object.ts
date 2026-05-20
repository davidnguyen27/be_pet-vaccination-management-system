export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): PhoneNumber {
    const cleaned = raw.trim().replace(/\s+/g, '');
    // Allow format VN: 0xxxxxxxxx or +84xxxxxxxxx
    if (!/^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(cleaned)) {
      throw new Error(`Invalid phone number format: ${raw}`);
    }
    return new PhoneNumber(cleaned);
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
