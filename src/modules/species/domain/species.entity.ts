import { SpeciesDeletedError } from './exceptions/species.error';
import { SpeciesCode } from './value-objects/species-code.value-object';

interface SpeciesProps {
  code: SpeciesCode;
  name: string;
  defaultVaccinePlan: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class SpeciesEntity {
  private readonly _id: string;
  private _props: SpeciesProps;

  private constructor(id: string, props: SpeciesProps) {
    this._id = id;
    this._props = props;
  }

  // Factory method
  static create(id: string, input: { code: string; name: string; defaultVaccinePlan?: boolean }): SpeciesEntity {
    return new SpeciesEntity(id, {
      code: SpeciesCode.create(input.code),
      name: SpeciesEntity.normalizeName(input.name),
      defaultVaccinePlan: input.defaultVaccinePlan ?? false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  // Reconstitute from DB
  static reconstitute(
    id: string,
    props: Omit<SpeciesProps, 'code'> & {
      code: string;
    },
  ): SpeciesEntity {
    return new SpeciesEntity(id, {
      ...props,
      code: SpeciesCode.create(props.code),
    });
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get code(): string {
    return this._props.code.toString();
  }
  get name(): string {
    return this._props.name;
  }
  get defaultVaccinePlan(): boolean {
    return this._props.defaultVaccinePlan;
  }
  get isDeleted(): boolean {
    return this._props.isDeleted;
  }
  get createdAt(): Date {
    return this._props.createdAt;
  }
  get updatedAt(): Date {
    return this._props.updatedAt;
  }
  get deletedAt(): Date | null {
    return this._props.deletedAt;
  }

  // Business logic methods
  update(input: { code?: string; name?: string; defaultVaccinePlan?: boolean }): void {
    if (this._props.isDeleted) {
      throw new SpeciesDeletedError(this._id);
    }

    if (input.code !== undefined) {
      this._props.code = SpeciesCode.create(input.code);
    }

    if (input.name !== undefined) {
      this._props.name = SpeciesEntity.normalizeName(input.name);
    }

    if (input.defaultVaccinePlan !== undefined) {
      this._props.defaultVaccinePlan = input.defaultVaccinePlan;
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new SpeciesDeletedError(this._id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }

  private static normalizeName(name: string): string {
    const normalized = name.trim();

    if (!normalized) {
      throw new Error('Species name is required');
    }

    return normalized;
  }
}
