import { VaccineLotStatus as VaccineLotStatusEnum } from '@/enums/vaccine';
import { VaccineLotStatusInvalidError } from '../exceptions/status.error';

export class VaccineLotStatus {
  private readonly _value: VaccineLotStatusEnum;

  private constructor(value: VaccineLotStatusEnum) {
    this._value = value;
  }

  static create(value: VaccineLotStatusEnum): VaccineLotStatus {
    if (!Object.values(VaccineLotStatusEnum).includes(value)) {
      throw new VaccineLotStatusInvalidError();
    }

    return new VaccineLotStatus(value);
  }

  get value(): VaccineLotStatusEnum {
    return this._value;
  }

  equals(other: VaccineLotStatus): boolean {
    return this._value === other.value;
  }
}
