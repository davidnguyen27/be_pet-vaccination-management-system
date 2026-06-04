import { MicrochipStatus } from '@/enums/microchip';
import { BatchId } from './value-objects/batch-id.value-object';
import { MicrochipCode } from './value-objects/microchip-code.value-object';
import { MicrochipStatus as MicrochipStatusValue } from './value-objects/microchip-status.value-object';
import { PetId } from './value-objects/pet-id.value-object';
import { MicrochipDeletedError } from './exceptions/microchip.error';

interface MicrochipProps {
  batchId: BatchId;
  microchipCode: MicrochipCode;
  status: MicrochipStatusValue;
  petId: PetId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MicrochipInput {
  batchId: string;
  microchipCode: string;
  status: MicrochipStatus;
  petId?: string | null;
}

interface MicrochipReconstitute extends MicrochipInput {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type MicrochipUpdateInput = Partial<MicrochipInput>;

export class MicrochipEntity {
  private readonly _id: string;
  private _props: MicrochipProps;

  private constructor(id: string, props: MicrochipProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: MicrochipInput): MicrochipEntity {
    const now = new Date();

    return new MicrochipEntity(id, {
      batchId: BatchId.create(input.batchId),
      microchipCode: MicrochipCode.create(input.microchipCode),
      status: MicrochipStatusValue.create(input.status),
      petId: PetId.create(input.petId),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: MicrochipReconstitute): MicrochipEntity {
    return new MicrochipEntity(id, {
      batchId: BatchId.create(input.batchId),
      microchipCode: MicrochipCode.create(input.microchipCode),
      status: MicrochipStatusValue.create(input.status),
      petId: PetId.create(input.petId),
      isDeleted: input.isDeleted,
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      deletedAt: input.deletedAt ? new Date(input.deletedAt) : null,
    });
  }

  get id(): string {
    return this._id;
  }

  get batchId(): string {
    return this._props.batchId.value;
  }

  get microchipCode(): string {
    return this._props.microchipCode.value;
  }

  get status(): MicrochipStatus {
    return this._props.status.value;
  }

  get petId(): string | null {
    return this._props.petId.value;
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

  update(input: MicrochipUpdateInput): void {
    if (this._props.isDeleted) {
      throw new MicrochipDeletedError(this.id);
    }

    if (input.batchId !== undefined) {
      this._props.batchId = BatchId.create(input.batchId);
    }
    if (input.microchipCode !== undefined) {
      this._props.microchipCode = MicrochipCode.create(input.microchipCode);
    }
    if (input.status !== undefined) {
      this._props.status = MicrochipStatusValue.create(input.status);
    }
    if (input.petId !== undefined) {
      this._props.petId = PetId.create(input.petId);
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new MicrochipDeletedError(this.id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }
}
