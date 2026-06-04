import { BatchIdRequiredError } from '../exceptions/batch-id.error';

export class BatchId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): BatchId {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new BatchIdRequiredError();

    return new BatchId(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: BatchId): boolean {
    return this._value === other.value;
  }
}
