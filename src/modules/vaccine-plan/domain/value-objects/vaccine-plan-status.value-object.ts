import { VaccinePlanStatus as VaccinePlanStatusEnum } from '@/enums/vaccine';
import { VaccinePlanStatusInvalidError } from '../exceptions/status.error';

export class VaccinePlanStatus {
  private readonly _value: VaccinePlanStatusEnum;

  private constructor(value: VaccinePlanStatusEnum) {
    this._value = value;
  }

  static create(value: VaccinePlanStatusEnum): VaccinePlanStatus {
    if (!Object.values(VaccinePlanStatusEnum).includes(value)) {
      throw new VaccinePlanStatusInvalidError();
    }

    return new VaccinePlanStatus(value);
  }

  get value(): VaccinePlanStatusEnum {
    return this._value;
  }

  equals(other: VaccinePlanStatus): boolean {
    return this._value === other.value;
  }
}
