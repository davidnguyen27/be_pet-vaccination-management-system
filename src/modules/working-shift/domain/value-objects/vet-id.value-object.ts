import { VetIdRequiredError } from '../exceptions/vet-id.error';

export class VetId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VetId {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new VetIdRequiredError();

    return new VetId(normalizedValue);
  }

  get value(): string {
    return this._value;
  }
}
