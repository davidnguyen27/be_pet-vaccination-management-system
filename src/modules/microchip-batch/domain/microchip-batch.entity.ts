import { BatchNo } from './value-objects/batch-no.value-object';
import { BatchNotes } from './value-objects/batch-notes.value-object';
import { ImportDate } from './value-objects/import-date.value-object';
import { TextField } from './value-objects/text-field.value-object';
import { TotalQuantity } from './value-objects/total-quantity.value-object';
import { MicrochipBatchDeletedError } from './exceptions/microchip-batch.error';

interface MicrochipBatchProps {
  batchNo: BatchNo;
  vendorName: TextField;
  manufacturer: TextField;
  model: TextField;
  importDate: ImportDate;
  totalQuantity: TotalQuantity;
  notes: BatchNotes;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MicrochipBatchInput {
  batchNo: string;
  vendorName: string;
  manufacturer: string;
  model: string;
  importDate: Date;
  totalQuantity: number;
  notes?: string | null;
}

interface MicrochipBatchReconstitute extends MicrochipBatchInput {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type MicrochipBatchUpdateInput = Partial<MicrochipBatchInput>;

export class MicrochipBatchEntity {
  private readonly _id: string;
  private _props: MicrochipBatchProps;

  private constructor(id: string, props: MicrochipBatchProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: MicrochipBatchInput): MicrochipBatchEntity {
    const now = new Date();

    return new MicrochipBatchEntity(id, {
      batchNo: BatchNo.create(input.batchNo),
      vendorName: TextField.create(input.vendorName, 'Vendor name', 150),
      manufacturer: TextField.create(input.manufacturer, 'Manufacturer', 150),
      model: TextField.create(input.model, 'Model', 100),
      importDate: ImportDate.create(input.importDate),
      totalQuantity: TotalQuantity.create(input.totalQuantity),
      notes: BatchNotes.create(input.notes),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: MicrochipBatchReconstitute): MicrochipBatchEntity {
    return new MicrochipBatchEntity(id, {
      batchNo: BatchNo.create(input.batchNo),
      vendorName: TextField.create(input.vendorName, 'Vendor name', 150),
      manufacturer: TextField.create(input.manufacturer, 'Manufacturer', 150),
      model: TextField.create(input.model, 'Model', 100),
      importDate: ImportDate.create(input.importDate),
      totalQuantity: TotalQuantity.create(input.totalQuantity),
      notes: BatchNotes.create(input.notes),
      isDeleted: input.isDeleted,
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      deletedAt: input.deletedAt ? new Date(input.deletedAt) : null,
    });
  }

  get id(): string {
    return this._id;
  }

  get batchNo(): string {
    return this._props.batchNo.value;
  }

  get vendorName(): string {
    return this._props.vendorName.value;
  }

  get manufacturer(): string {
    return this._props.manufacturer.value;
  }

  get model(): string {
    return this._props.model.value;
  }

  get importDate(): Date {
    return this._props.importDate.value;
  }

  get totalQuantity(): number {
    return this._props.totalQuantity.value;
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

  update(input: MicrochipBatchUpdateInput): void {
    if (this._props.isDeleted) {
      throw new MicrochipBatchDeletedError(this.id);
    }

    if (input.batchNo !== undefined) {
      this._props.batchNo = BatchNo.create(input.batchNo);
    }
    if (input.vendorName !== undefined) {
      this._props.vendorName = TextField.create(input.vendorName, 'Vendor name', 150);
    }
    if (input.manufacturer !== undefined) {
      this._props.manufacturer = TextField.create(input.manufacturer, 'Manufacturer', 150);
    }
    if (input.model !== undefined) {
      this._props.model = TextField.create(input.model, 'Model', 100);
    }
    if (input.importDate !== undefined) {
      this._props.importDate = ImportDate.create(input.importDate);
    }
    if (input.totalQuantity !== undefined) {
      this._props.totalQuantity = TotalQuantity.create(input.totalQuantity);
    }
    if (input.notes !== undefined) {
      this._props.notes = BatchNotes.create(input.notes);
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new MicrochipBatchDeletedError(this.id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }
}
