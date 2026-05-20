import { EmploymentStatus } from '@/enums';
import { LicenseNo } from './value-objects/license-no.value-object';
import { JoinDate } from './value-objects/join-date.value-object';
import { CitizenId } from './value-objects/citizen-id.value-object';
import { LicenseIssue } from './value-objects/license-issue-by.value-object';

interface VetProps {
  userId: string;
  bio: string;
  licenseNo: LicenseNo;
  licenseIssueBy: LicenseIssue;
  licenseValidFrom: Date;
  licenseValidTo: Date;
  joinDate: JoinDate;
  endDate: Date | null;
  address: string;
  citizenId: CitizenId;
  employmentStatus: EmploymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

type VetInput = Omit<
  VetProps,
  'licenseNo' | 'licenseIssueBy' | 'joinDate' | 'citizenId' | 'createdAt' | 'updatedAt'
> & {
  licenseNo: string;
  licenseIssueBy: string;
  joinDate: Date;
  citizenId: string;
};

type VetReconstitute = Omit<VetProps, 'licenseNo' | 'licenseIssueBy' | 'joinDate' | 'citizenId'> & {
  licenseNo: string;
  licenseIssueBy: string;
  joinDate: Date;
  citizenId: string;
};

export class VetEntity {
  private readonly _id: string;
  private _props: VetProps;

  private constructor(id: string, props: VetProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: VetInput): VetEntity {
    const now = new Date();
    return new VetEntity(id, {
      userId: input.userId,
      bio: input.bio,
      licenseNo: new LicenseNo(input.licenseNo),
      licenseIssueBy: new LicenseIssue(input.licenseIssueBy),
      licenseValidFrom: new Date(input.licenseValidFrom),
      licenseValidTo: new Date(input.licenseValidTo),
      joinDate: new JoinDate(input.joinDate),
      endDate: input.endDate ?? null,
      address: input.address,
      citizenId: new CitizenId(input.citizenId),
      employmentStatus: input.employmentStatus,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(id: string, input: VetReconstitute): VetEntity {
    return new VetEntity(id, {
      userId: input.userId,
      bio: input.bio,
      licenseNo: new LicenseNo(input.licenseNo),
      licenseIssueBy: new LicenseIssue(input.licenseIssueBy),
      licenseValidFrom: new Date(input.licenseValidFrom),
      licenseValidTo: new Date(input.licenseValidTo),
      joinDate: new JoinDate(input.joinDate),
      endDate: input.endDate ?? null,
      address: input.address,
      citizenId: new CitizenId(input.citizenId),
      employmentStatus: input.employmentStatus,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._props.userId;
  }
  get bio(): string {
    return this._props.bio;
  }
  get licenseNo(): string {
    return this._props.licenseNo.value;
  }
  get licenseIssueBy(): string {
    return this._props.licenseIssueBy.value;
  }
  get licenseValidFrom(): Date {
    return new Date(this._props.licenseValidFrom);
  }
  get licenseValidTo(): Date {
    return new Date(this._props.licenseValidTo);
  }
  get joinDate(): Date {
    return new Date(this._props.joinDate.value);
  }
  get endDate(): Date | null {
    return this._props.endDate ? new Date(this._props.endDate) : null;
  }
  get address(): string {
    return this._props.address;
  }
  get citizenId(): string {
    return this._props.citizenId.value;
  }
  get employmentStatus(): EmploymentStatus {
    return this._props.employmentStatus;
  }
  get createdAt(): Date {
    return new Date(this._props.createdAt);
  }
  get updatedAt(): Date {
    return new Date(this._props.updatedAt);
  }

  // Business logic method
  update(input: Partial<VetInput>): void {
    if (input.bio !== undefined) {
      this._props.bio = input.bio;
    }
    if (input.licenseNo !== undefined) {
      this._props.licenseNo = new LicenseNo(input.licenseNo);
    }
    if (input.licenseIssueBy !== undefined) {
      this._props.licenseIssueBy = new LicenseIssue(input.licenseIssueBy);
    }
    if (input.licenseValidFrom !== undefined) {
      this._props.licenseValidFrom = new Date(input.licenseValidFrom);
    }
    if (input.licenseValidTo !== undefined) {
      this._props.licenseValidTo = new Date(input.licenseValidTo);
    }
    if (input.joinDate !== undefined) {
      this._props.joinDate = new JoinDate(input.joinDate);
    }
    if (input.endDate !== undefined) {
      this._props.endDate = input.endDate ?? null;
    }
    if (input.address !== undefined) {
      this._props.address = input.address;
    }
    if (input.citizenId !== undefined) {
      this._props.citizenId = new CitizenId(input.citizenId);
    }
    if (input.employmentStatus !== undefined) {
      this._props.employmentStatus = input.employmentStatus;
    }

    this._props.updatedAt = new Date();
  }
}
