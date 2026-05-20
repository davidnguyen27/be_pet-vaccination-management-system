import { PetGender } from '@/enums/pet';

export class Gender {
  private readonly _value: PetGender;

  constructor(value: string) {
    const gender = value.trim().toUpperCase();
    if (!gender) throw new Error('Gender is required');
    if (!Object.values(PetGender).includes(gender as PetGender)) throw new Error('Gender is invalid');
    this._value = gender as PetGender;
  }

  get value(): PetGender {
    return this._value;
  }
}
