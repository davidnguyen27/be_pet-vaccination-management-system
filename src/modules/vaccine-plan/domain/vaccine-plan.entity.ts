import { VaccinePlanStatus } from '@/enums/vaccine';
import { DoseNo } from './value-objects/dose-no.value-object';
import { PetId } from './value-objects/pet-id.value-object';
import { PlanDate } from './value-objects/plan-date.value-object';
import { VaccinationRecordId } from './value-objects/vaccination-record-id.value-object';
import { VaccineId } from './value-objects/vaccine-id.value-object';
import { VaccinePlanNote } from './value-objects/vaccine-plan-note.value-object';
import { VaccinePlanStatus as VaccinePlanStatusValue } from './value-objects/vaccine-plan-status.value-object';
import { VaccinePlanDeletedError } from './exceptions/vaccine-plan.error';

interface VaccinePlanProps {
  petId: PetId;
  vaccineId: VaccineId;
  doseNo: DoseNo;
  dueDate: PlanDate;
  dueFrom: PlanDate | null;
  dueTo: PlanDate | null;
  status: VaccinePlanStatusValue;
  vaccinationRecordId: VaccinationRecordId;
  completedAt: PlanDate | null;
  remindAt: PlanDate | null;
  lastRemindedAt: PlanDate | null;
  note: VaccinePlanNote;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface VaccinePlanInput {
  petId: string;
  vaccineId: string;
  doseNo: number;
  dueDate: Date;
  dueFrom?: Date | null;
  dueTo?: Date | null;
  status: VaccinePlanStatus;
  vaccinationRecordId?: string | null;
  completedAt?: Date | null;
  remindAt?: Date | null;
  lastRemindedAt?: Date | null;
  note?: string | null;
}

interface VaccinePlanReconstitute extends VaccinePlanInput {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type VaccinePlanUpdateInput = Partial<VaccinePlanInput>;

export class VaccinePlanEntity {
  private readonly _id: string;
  private _props: VaccinePlanProps;

  private constructor(id: string, props: VaccinePlanProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: VaccinePlanInput): VaccinePlanEntity {
    const now = new Date();
    const dueDate = PlanDate.create(input.dueDate, 'Due date');
    const dueFrom = PlanDate.createOptional(input.dueFrom, 'Due from');
    const dueTo = PlanDate.createOptional(input.dueTo, 'Due to');
    PlanDate.ensureWindow(dueDate.value, dueFrom?.value ?? null, dueTo?.value ?? null);

    return new VaccinePlanEntity(id, {
      petId: PetId.create(input.petId),
      vaccineId: VaccineId.create(input.vaccineId),
      doseNo: DoseNo.create(input.doseNo),
      dueDate,
      dueFrom,
      dueTo,
      status: VaccinePlanStatusValue.create(input.status),
      vaccinationRecordId: VaccinationRecordId.create(input.vaccinationRecordId),
      completedAt: PlanDate.createOptional(input.completedAt, 'Completed at'),
      remindAt: PlanDate.createOptional(input.remindAt, 'Remind at'),
      lastRemindedAt: PlanDate.createOptional(input.lastRemindedAt, 'Last reminded at'),
      note: VaccinePlanNote.create(input.note),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: VaccinePlanReconstitute): VaccinePlanEntity {
    const dueDate = PlanDate.create(input.dueDate, 'Due date');
    const dueFrom = PlanDate.createOptional(input.dueFrom, 'Due from');
    const dueTo = PlanDate.createOptional(input.dueTo, 'Due to');
    PlanDate.ensureWindow(dueDate.value, dueFrom?.value ?? null, dueTo?.value ?? null);

    return new VaccinePlanEntity(id, {
      petId: PetId.create(input.petId),
      vaccineId: VaccineId.create(input.vaccineId),
      doseNo: DoseNo.create(input.doseNo),
      dueDate,
      dueFrom,
      dueTo,
      status: VaccinePlanStatusValue.create(input.status),
      vaccinationRecordId: VaccinationRecordId.create(input.vaccinationRecordId),
      completedAt: PlanDate.createOptional(input.completedAt, 'Completed at'),
      remindAt: PlanDate.createOptional(input.remindAt, 'Remind at'),
      lastRemindedAt: PlanDate.createOptional(input.lastRemindedAt, 'Last reminded at'),
      note: VaccinePlanNote.create(input.note),
      isDeleted: input.isDeleted,
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      deletedAt: input.deletedAt ? new Date(input.deletedAt) : null,
    });
  }

  get id(): string {
    return this._id;
  }

  get petId(): string {
    return this._props.petId.value;
  }

  get vaccineId(): string {
    return this._props.vaccineId.value;
  }

  get doseNo(): number {
    return this._props.doseNo.value;
  }

  get dueDate(): Date {
    return this._props.dueDate.value;
  }

  get dueFrom(): Date | null {
    return this._props.dueFrom?.value ?? null;
  }

  get dueTo(): Date | null {
    return this._props.dueTo?.value ?? null;
  }

  get status(): VaccinePlanStatus {
    return this._props.status.value;
  }

  get vaccinationRecordId(): string | null {
    return this._props.vaccinationRecordId.value;
  }

  get completedAt(): Date | null {
    return this._props.completedAt?.value ?? null;
  }

  get remindAt(): Date | null {
    return this._props.remindAt?.value ?? null;
  }

  get lastRemindedAt(): Date | null {
    return this._props.lastRemindedAt?.value ?? null;
  }

  get note(): string | null {
    return this._props.note.value;
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

  update(input: VaccinePlanUpdateInput): void {
    if (this._props.isDeleted) {
      throw new VaccinePlanDeletedError(this.id);
    }

    const nextDueDate = input.dueDate !== undefined ? PlanDate.create(input.dueDate, 'Due date') : this._props.dueDate;
    const nextDueFrom =
      input.dueFrom !== undefined ? PlanDate.createOptional(input.dueFrom, 'Due from') : this._props.dueFrom;
    const nextDueTo = input.dueTo !== undefined ? PlanDate.createOptional(input.dueTo, 'Due to') : this._props.dueTo;

    PlanDate.ensureWindow(nextDueDate.value, nextDueFrom?.value ?? null, nextDueTo?.value ?? null);

    if (input.petId !== undefined) {
      this._props.petId = PetId.create(input.petId);
    }
    if (input.vaccineId !== undefined) {
      this._props.vaccineId = VaccineId.create(input.vaccineId);
    }
    if (input.doseNo !== undefined) {
      this._props.doseNo = DoseNo.create(input.doseNo);
    }
    if (input.dueDate !== undefined) {
      this._props.dueDate = nextDueDate;
    }
    if (input.dueFrom !== undefined) {
      this._props.dueFrom = nextDueFrom;
    }
    if (input.dueTo !== undefined) {
      this._props.dueTo = nextDueTo;
    }
    if (input.status !== undefined) {
      this._props.status = VaccinePlanStatusValue.create(input.status);
    }
    if (input.vaccinationRecordId !== undefined) {
      this._props.vaccinationRecordId = VaccinationRecordId.create(input.vaccinationRecordId);
    }
    if (input.completedAt !== undefined) {
      this._props.completedAt = PlanDate.createOptional(input.completedAt, 'Completed at');
    }
    if (input.remindAt !== undefined) {
      this._props.remindAt = PlanDate.createOptional(input.remindAt, 'Remind at');
    }
    if (input.lastRemindedAt !== undefined) {
      this._props.lastRemindedAt = PlanDate.createOptional(input.lastRemindedAt, 'Last reminded at');
    }
    if (input.note !== undefined) {
      this._props.note = VaccinePlanNote.create(input.note);
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new VaccinePlanDeletedError(this.id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }
}
