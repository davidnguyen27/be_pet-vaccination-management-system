export class PetDob {
  private readonly _value: Date;

  constructor(value: Date) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error('Date of birth is required');
    }
    this._value = date;
  }

  get value(): Date {
    return this._value;
  }
}
