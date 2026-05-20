import { VaccineStatus as VaccineStatusEnum } from '@/enums/vaccine';
import { VaccineStatusInvalidError } from '../exceptions/status.error';

export class VaccineStatus {
  private readonly _value: VaccineStatusEnum;

  private constructor(value: VaccineStatusEnum) {
    this._value = value;
  }

  static create(value: VaccineStatusEnum): VaccineStatus {
    if (!Object.values(VaccineStatusEnum).includes(value)) {
      throw new VaccineStatusInvalidError();
    }
    return new VaccineStatus(value);
  }

  get value(): VaccineStatusEnum {
    return this._value;
  }

  equals(other: VaccineStatus): boolean {
    return this._value === other.value;
  }
}
