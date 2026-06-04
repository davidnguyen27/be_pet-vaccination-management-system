import { WorkingShiftDeletedError } from './exceptions/working-shift.error';
import { DayOfWeek } from './value-objects/day-of-week.value-object';
import { MaxAppointments, SlotDuration } from './value-objects/shift-capacity.value-object';
import { ShiftNotes } from './value-objects/shift-notes.value-object';
import { ShiftTime } from './value-objects/shift-time.value-object';
import { VetId } from './value-objects/vet-id.value-object';
import { Weekday } from './working-shift.types';

interface WorkingShiftProps {
  vetId: VetId;
  dayOfWeek: DayOfWeek;
  startTime: ShiftTime;
  endTime: ShiftTime;
  slotDuration: SlotDuration;
  maxAppointments: MaxAppointments;
  notes: ShiftNotes;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface WorkingShiftInput {
  vetId: string;
  dayOfWeek: Weekday;
  startTime: Date;
  endTime: Date;
  slotDuration?: number;
  maxAppointments?: number;
  notes?: string | null;
}

interface WorkingShiftReconstitute extends WorkingShiftInput {
  slotDuration: number;
  maxAppointments: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type WorkingShiftUpdateInput = Partial<WorkingShiftInput>;

type WorkingShiftSchedule = Pick<
  WorkingShiftProps,
  'vetId' | 'dayOfWeek' | 'startTime' | 'endTime' | 'slotDuration' | 'maxAppointments' | 'notes'
>;

export class WorkingShiftEntity {
  private readonly _id: string;
  private _props: WorkingShiftProps;

  private constructor(id: string, props: WorkingShiftProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: WorkingShiftInput): WorkingShiftEntity {
    const now = new Date();

    return new WorkingShiftEntity(id, {
      ...WorkingShiftEntity.createSchedule(input),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: WorkingShiftReconstitute): WorkingShiftEntity {
    return new WorkingShiftEntity(id, {
      ...WorkingShiftEntity.createSchedule(input),
      isDeleted: input.isDeleted,
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      deletedAt: input.deletedAt ? new Date(input.deletedAt) : null,
    });
  }

  get id(): string {
    return this._id;
  }

  get vetId(): string {
    return this._props.vetId.value;
  }

  get dayOfWeek(): Weekday {
    return this._props.dayOfWeek.value;
  }

  get startTime(): Date {
    return this._props.startTime.value;
  }

  get endTime(): Date {
    return this._props.endTime.value;
  }

  get slotDuration(): number {
    return this._props.slotDuration.value;
  }

  get maxAppointments(): number {
    return this._props.maxAppointments.value;
  }

  get notes(): string | null {
    return this._props.notes.value;
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

  update(input: WorkingShiftUpdateInput): void {
    if (this._props.isDeleted) {
      throw new WorkingShiftDeletedError(this.id);
    }

    const schedule = WorkingShiftEntity.createSchedule({
      vetId: input.vetId ?? this.vetId,
      dayOfWeek: input.dayOfWeek ?? this.dayOfWeek,
      startTime: input.startTime ?? this.startTime,
      endTime: input.endTime ?? this.endTime,
      slotDuration: input.slotDuration ?? this.slotDuration,
      maxAppointments: input.maxAppointments ?? this.maxAppointments,
      notes: input.notes !== undefined ? input.notes : this.notes,
    });

    this._props = {
      ...this._props,
      ...schedule,
      updatedAt: new Date(),
    };
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new WorkingShiftDeletedError(this.id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }

  private static createSchedule(input: WorkingShiftInput): WorkingShiftSchedule {
    const startTime = ShiftTime.create(input.startTime, 'Start time');
    const endTime = ShiftTime.create(input.endTime, 'End time');
    ShiftTime.ensureValidRange(startTime, endTime);

    const shiftDurationMinutes = ShiftTime.durationMinutes(startTime, endTime);

    return {
      vetId: VetId.create(input.vetId),
      dayOfWeek: DayOfWeek.create(input.dayOfWeek),
      startTime,
      endTime,
      slotDuration: SlotDuration.create(input.slotDuration ?? 30, shiftDurationMinutes),
      maxAppointments: MaxAppointments.create(input.maxAppointments ?? 1),
      notes: ShiftNotes.create(input.notes),
    };
  }
}
