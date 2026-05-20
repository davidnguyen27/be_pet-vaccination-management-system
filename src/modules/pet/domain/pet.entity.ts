import { PetDeletedError } from './exceptions/pet.error';
import { PetName } from './value-objects/pet-name.value-object';
import { PetWeight } from './value-objects/pet-weight.value-object';
import { PetDob } from './value-objects/pet-dob.value-object';
import { Gender } from './value-objects/pet-gender.value-object';
import { PetGender } from '@/enums/pet';

interface PetProps {
  ownerId: string;
  speciesId: string;
  name: PetName;
  sex: Gender;
  dob: PetDob;
  weight: PetWeight;
  color: string;
  breed: string;
  note: string | null;
  isSterilized: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type PetInput = Omit<
  PetProps,
  'name' | 'sex' | 'dob' | 'weight' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'deletedAt'
> & {
  name: string;
  sex: string;
  dob: Date;
  weight: number;
};

type PetReconstitute = Omit<PetProps, 'name' | 'sex' | 'dob' | 'weight'> & {
  name: string;
  sex: string;
  dob: Date;
  weight: number;
};

export class PetEntity {
  private readonly _id: string;
  private _props: PetProps;

  private constructor(id: string, props: PetProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: PetInput): PetEntity {
    const now = new Date();
    return new PetEntity(id, {
      ownerId: input.ownerId,
      speciesId: input.speciesId,
      name: new PetName(input.name),
      sex: new Gender(input.sex),
      dob: new PetDob(input.dob),
      weight: new PetWeight(input.weight),
      color: input.color,
      breed: input.breed,
      note: input.note ?? null,
      isSterilized: input.isSterilized,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: PetReconstitute): PetEntity {
    return new PetEntity(id, {
      ownerId: input.ownerId,
      speciesId: input.speciesId,
      name: new PetName(input.name),
      sex: new Gender(input.sex),
      dob: new PetDob(input.dob),
      weight: new PetWeight(input.weight),
      color: input.color,
      breed: input.breed,
      note: input.note ?? null,
      isSterilized: input.isSterilized,
      isDeleted: input.isDeleted,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      deletedAt: input.deletedAt,
    });
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get ownerId(): string {
    return this._props.ownerId;
  }
  get speciesId(): string {
    return this._props.speciesId;
  }
  get name(): string {
    return this._props.name.value;
  }
  get sex(): PetGender {
    return this._props.sex.value;
  }
  get dob(): Date {
    return new Date(this._props.dob.value);
  }
  get weight(): number {
    return this._props.weight.value;
  }
  get color(): string {
    return this._props.color;
  }
  get breed(): string {
    return this._props.breed;
  }
  get note(): string | null {
    return this._props.note;
  }
  get isSterilized(): boolean {
    return this._props.isSterilized;
  }
  get isDeleted(): boolean {
    return this._props.isDeleted;
  }
  get createdAt(): Date {
    return new Date(this._props.createdAt);
  }
  get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }
  get deletedAt(): Date | null {
    return this._props.deletedAt ? new Date(this._props.deletedAt) : null;
  }

  // Business logic methods
  update(input: Partial<PetInput>): void {
    if (this._props.isDeleted) {
      throw new PetDeletedError(this._id);
    }

    if (input.ownerId !== undefined) {
      this._props.ownerId = input.ownerId;
    }
    if (input.speciesId !== undefined) {
      this._props.speciesId = input.speciesId;
    }
    if (input.name !== undefined) {
      this._props.name = new PetName(input.name);
    }
    if (input.sex !== undefined) {
      this._props.sex = new Gender(input.sex);
    }
    if (input.dob !== undefined) {
      this._props.dob = new PetDob(input.dob);
    }
    if (input.weight !== undefined) {
      this._props.weight = new PetWeight(input.weight);
    }
    if (input.color !== undefined) {
      this._props.color = input.color;
    }
    if (input.breed !== undefined) {
      this._props.breed = input.breed;
    }
    if (input.note !== undefined) {
      this._props.note = input.note;
    }
    if (input.isSterilized !== undefined) {
      this._props.isSterilized = input.isSterilized;
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    const now = new Date();
    if (this._props.isDeleted) {
      throw new PetDeletedError(this._id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = now;
    this._props.updatedAt = now;
  }
}
