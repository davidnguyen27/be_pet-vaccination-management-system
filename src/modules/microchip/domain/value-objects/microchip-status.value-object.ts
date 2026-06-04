import { MicrochipStatus as MicrochipStatusEnum } from '@/enums/microchip';
import { MicrochipStatusInvalidError } from '../exceptions/status.error';

export class MicrochipStatus {
  private readonly _value: MicrochipStatusEnum;

  private constructor(value: MicrochipStatusEnum) {
    this._value = value;
  }

  static create(value: MicrochipStatusEnum): MicrochipStatus {
    if (!Object.values(MicrochipStatusEnum).includes(value)) {
      throw new MicrochipStatusInvalidError();
    }

    return new MicrochipStatus(value);
  }

  get value(): MicrochipStatusEnum {
    return this._value;
  }

  equals(other: MicrochipStatus): boolean {
    return this._value === other.value;
  }
}
