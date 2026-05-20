import {
  StorageTempMaxInvalidError,
  StorageTempMaxRequiredError,
  StorageTempMinGreaterThanOrEqualMaxError,
  StorageTempMinInvalidError,
  StorageTempMinRequiredError,
  StorageTempOutOfRangeError,
} from '../exceptions/storage-temp.error';

export class StorageTemp {
  private static readonly ALLOWED_MIN = -100;
  private static readonly ALLOWED_MAX = 100;

  private readonly _min: number;
  private readonly _max: number;

  private constructor(min: number, max: number) {
    this._min = min;
    this._max = max;
  }

  static create(min: number, max: number): StorageTemp {
    if (min === null || min === undefined) throw new StorageTempMinRequiredError();
    if (max === null || max === undefined) throw new StorageTempMaxRequiredError();
    if (!Number.isFinite(min)) throw new StorageTempMinInvalidError();
    if (!Number.isFinite(max)) throw new StorageTempMaxInvalidError();
    if (min >= max) throw new StorageTempMinGreaterThanOrEqualMaxError();
    if (min < this.ALLOWED_MIN || max > this.ALLOWED_MAX) throw new StorageTempOutOfRangeError();

    return new StorageTemp(min, max);
  }

  get min(): number {
    return this._min;
  }

  get max(): number {
    return this._max;
  }

  equals(other: StorageTemp): boolean {
    return this._min === other.min && this._max === other.max;
  }
}
