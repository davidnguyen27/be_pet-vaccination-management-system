import { BatchNoRequiredError, BatchNoTooLongError } from '../exceptions/batch-no.error';

export class BatchNo {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): BatchNo {
    const normalizedValue = value?.trim();
    if (!normalizedValue) throw new BatchNoRequiredError();
    if (normalizedValue.length > 80) throw new BatchNoTooLongError();

    return new BatchNo(normalizedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: BatchNo): boolean {
    return this._value === other.value;
  }
}
