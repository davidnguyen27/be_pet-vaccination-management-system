import { EmploymentStatus, employment_type } from '@/enums';
import { EmploymentAlreadyEndedError, InvalidEmploymentDateError } from '@/modules/staff/domain/exceptions/staff.error';
import { CitizenId } from '@/modules/staff/domain/value-objects/citizen-id.value-object';
import { StaffCode } from '@/modules/staff/domain/value-objects/staff-code.value-object';

interface StaffProps {
  userId: string;
  code: StaffCode;
  jobTitle: string | null;
  department: string | null;
  employmentType: employment_type;
  employmentStatus: EmploymentStatus;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: CitizenId;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StaffInput {
  userId: string;
  code: string;
  jobTitle: string | null;
  department: string | null;
  employmentType: employment_type;
  employmentStatus: EmploymentStatus;
  joinDate: Date;
  endDate?: Date | null;
  address: string;
  citizenId: string;
  notes: string | null;
}

interface StaffReconstituteInput extends StaffInput {
  createdAt: Date;
  updatedAt: Date;
}

export class StaffEntity {
  private readonly _id: string;
  private _props: StaffProps;

  private constructor(id: string, props: StaffProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: StaffInput): StaffEntity {
    const entity = new StaffEntity(id, {
      userId: input.userId,
      code: StaffCode.create(input.code),
      jobTitle: StaffEntity.normalizeNullableText(input.jobTitle),
      department: StaffEntity.normalizeNullableText(input.department),
      employmentType: input.employmentType,
      employmentStatus: input.employmentStatus,
      joinDate: new Date(input.joinDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      address: StaffEntity.normalizeRequiredText(input.address, 'Address is required'),
      citizenId: CitizenId.create(input.citizenId),
      notes: StaffEntity.normalizeNullableText(input.notes),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.ensureValidEmploymentDates(entity.joinDate, entity.endDate);

    return entity;
  }

  static reconstitute(id: string, input: StaffReconstituteInput): StaffEntity {
    const entity = new StaffEntity(id, {
      userId: input.userId,
      code: StaffCode.create(input.code),
      jobTitle: StaffEntity.normalizeNullableText(input.jobTitle),
      department: StaffEntity.normalizeNullableText(input.department),
      employmentType: input.employmentType,
      employmentStatus: input.employmentStatus,
      joinDate: new Date(input.joinDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      address: StaffEntity.normalizeRequiredText(input.address, 'Address is required'),
      citizenId: CitizenId.create(input.citizenId),
      notes: StaffEntity.normalizeNullableText(input.notes),
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
    });

    entity.ensureValidEmploymentDates(entity.joinDate, entity.endDate);

    return entity;
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._props.userId;
  }
  get code(): string {
    return this._props.code.toString();
  }
  get jobTitle(): string | null {
    return this._props.jobTitle;
  }
  get department(): string | null {
    return this._props.department;
  }
  get employmentType(): employment_type {
    return this._props.employmentType;
  }
  get employmentStatus(): EmploymentStatus {
    return this._props.employmentStatus;
  }
  get joinDate(): Date {
    return new Date(this._props.joinDate);
  }
  get endDate(): Date | null {
    return this._props.endDate ? new Date(this._props.endDate) : null;
  }
  get address(): string {
    return this._props.address;
  }
  get citizenId(): string {
    return this._props.citizenId.toString();
  }
  get notes(): string | null {
    return this._props.notes;
  }
  get createdAt(): Date {
    return new Date(this._props.createdAt);
  }
  get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  update(input: {
    code?: string;
    jobTitle?: string | null;
    department?: string | null;
    employmentType?: employment_type;
    employmentStatus?: EmploymentStatus;
    joinDate?: Date;
    endDate?: Date | null;
    address?: string;
    citizenId?: string;
    notes?: string | null;
  }): void {
    if (input.code !== undefined) {
      this._props.code = StaffCode.create(input.code);
    }

    if (input.jobTitle !== undefined) {
      this._props.jobTitle = StaffEntity.normalizeNullableText(input.jobTitle);
    }

    if (input.department !== undefined) {
      this._props.department = StaffEntity.normalizeNullableText(input.department);
    }

    if (input.employmentType !== undefined) {
      this._props.employmentType = input.employmentType;
    }

    if (input.employmentStatus !== undefined) {
      this._props.employmentStatus = input.employmentStatus;
    }

    if (input.joinDate !== undefined) {
      this._props.joinDate = new Date(input.joinDate);
    }

    if (input.endDate !== undefined) {
      this._props.endDate = input.endDate ? new Date(input.endDate) : null;
    }

    if (input.address !== undefined) {
      this._props.address = StaffEntity.normalizeRequiredText(input.address, 'Address is required');
    }

    if (input.citizenId !== undefined) {
      this._props.citizenId = CitizenId.create(input.citizenId);
    }

    if (input.notes !== undefined) {
      this._props.notes = StaffEntity.normalizeNullableText(input.notes);
    }

    this.ensureValidEmploymentDates(this._props.joinDate, this._props.endDate);
    this._props.updatedAt = new Date();
  }

  markEmploymentEnded(endDate: Date): void {
    if (this._props.endDate) {
      throw new EmploymentAlreadyEndedError(this._id);
    }

    const normalizedEndDate = new Date(endDate);
    this.ensureValidEmploymentDates(this._props.joinDate, normalizedEndDate);

    this._props.endDate = normalizedEndDate;
    this._props.updatedAt = new Date();
  }

  private ensureValidEmploymentDates(joinDate: Date, endDate: Date | null): void {
    if (endDate && endDate < joinDate) {
      throw new InvalidEmploymentDateError(this._id);
    }
  }

  private static normalizeNullableText(value: string | null | undefined): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private static normalizeRequiredText(value: string, message: string): string {
    const normalized = value.trim();
    if (!normalized) {
      throw new Error(message);
    }

    return normalized;
  }
}
