import { VaccineStatus } from '@/enums/vaccine';
import { VaccineDeletedError } from './exceptions/vaccine.error';
import { Code } from './value-objects/code.value-object';
import { DefaultNextDueDays } from './value-objects/default-next-due-days.value-object';
import { DefaultTotalDoses } from './value-objects/default-total-doses.value-object';
import { DoseUnit } from './value-objects/dose-unit.value-object';
import { DoseValue } from './value-objects/dose-value.value-object';
import { VaccineBrand } from './value-objects/vaccine-brand.value-object';
import { VaccineDate } from './value-objects/vaccine-date.value-object';
import { VaccineName } from './value-objects/vaccine-name.value-object';
import { VaccineStatus as VaccineStatusValue } from './value-objects/vaccine-status.value-object';

interface VaccineProps {
  speciesId: string;
  code: Code;
  name: VaccineName;
  brand: VaccineBrand;
  imgUrl: string | null;
  description: string | null;
  doseValue: DoseValue;
  doseUnit: DoseUnit;
  status: VaccineStatusValue;
  defaultTotalDoses: DefaultTotalDoses;
  defaultNextDueDays: DefaultNextDueDays;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface VaccineInput {
  speciesId: string;
  code: string;
  name: string;
  brand: string;
  imgUrl: string | null;
  description?: string | null;
  doseValue: number;
  doseUnit: string;
  status: VaccineStatus;
  defaultTotalDoses: number;
  defaultNextDueDays: number;
}

interface VaccineReconstitute extends VaccineInput {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class VaccineEntity {
  private readonly _id: string;
  private _props: VaccineProps;

  private constructor(id: string, props: VaccineProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: VaccineInput): VaccineEntity {
    const now = new Date();
    return new VaccineEntity(id, {
      speciesId: input.speciesId,
      code: Code.create(input.code),
      name: VaccineName.create(input.name),
      brand: VaccineBrand.create(input.brand),
      imgUrl: input.imgUrl ?? null,
      description: input.description ?? null,
      doseValue: DoseValue.create(input.doseValue),
      doseUnit: DoseUnit.create(input.doseUnit),
      status: VaccineStatusValue.create(input.status),
      defaultTotalDoses: DefaultTotalDoses.create(input.defaultTotalDoses),
      defaultNextDueDays: DefaultNextDueDays.create(input.defaultNextDueDays),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: VaccineReconstitute): VaccineEntity {
    return new VaccineEntity(id, {
      speciesId: input.speciesId,
      code: Code.create(input.code),
      name: VaccineName.create(input.name),
      brand: VaccineBrand.create(input.brand),
      imgUrl: input.imgUrl ?? null,
      description: input.description ?? null,
      doseValue: DoseValue.create(input.doseValue),
      doseUnit: DoseUnit.create(input.doseUnit),
      status: VaccineStatusValue.create(input.status),
      defaultTotalDoses: DefaultTotalDoses.create(input.defaultTotalDoses),
      defaultNextDueDays: DefaultNextDueDays.create(input.defaultNextDueDays),
      isDeleted: input.isDeleted,
      createdAt: VaccineDate.create(input.createdAt, 'createdAt').value,
      updatedAt: VaccineDate.create(input.updatedAt, 'updatedAt').value,
      deletedAt: input.deletedAt ? VaccineDate.create(input.deletedAt, 'deletedAt').value : null,
    });
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get speciesId(): string {
    return this._props.speciesId;
  }
  get code(): string {
    return this._props.code.value;
  }
  get name(): string {
    return this._props.name.value;
  }
  get brand(): string {
    return this._props.brand.value;
  }
  get description(): string | null {
    return this._props.description;
  }
  get imgUrl(): string | null {
    return this._props.imgUrl;
  }
  get doseValue(): number {
    return this._props.doseValue.value;
  }
  get doseUnit(): string {
    return this._props.doseUnit.value;
  }
  get status(): VaccineStatus {
    return this._props.status.value;
  }
  get defaultTotalDoses(): number {
    return this._props.defaultTotalDoses.value;
  }
  get defaultNextDueDays(): number {
    return this._props.defaultNextDueDays.value;
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
  update(input: Partial<VaccineInput>): void {
    if (this._props.isDeleted) {
      throw new VaccineDeletedError(this.id);
    }

    if (input.speciesId !== undefined) {
      this._props.speciesId = input.speciesId;
    }
    if (input.code !== undefined) {
      this._props.code = Code.create(input.code);
    }
    if (input.name !== undefined) {
      this._props.name = VaccineName.create(input.name);
    }
    if (input.brand !== undefined) {
      this._props.brand = VaccineBrand.create(input.brand);
    }
    if (input.description !== undefined) {
      this._props.description = input.description;
    }
    if (input.imgUrl !== undefined) {
      this._props.imgUrl = input.imgUrl ?? null;
    }
    if (input.doseValue !== undefined) {
      this._props.doseValue = DoseValue.create(input.doseValue);
    }
    if (input.doseUnit !== undefined) {
      this._props.doseUnit = DoseUnit.create(input.doseUnit);
    }
    if (input.status !== undefined) {
      this._props.status = VaccineStatusValue.create(input.status);
    }
    if (input.defaultTotalDoses !== undefined) {
      this._props.defaultTotalDoses = DefaultTotalDoses.create(input.defaultTotalDoses);
    }
    if (input.defaultNextDueDays !== undefined) {
      this._props.defaultNextDueDays = DefaultNextDueDays.create(input.defaultNextDueDays);
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new VaccineDeletedError(this.id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }
}
