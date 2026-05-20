import { VaccineLotStatus } from '@/enums/vaccine';
import { VaccineLotDeletedError } from './exceptions/vaccine-lot.error';
import { ExpDate } from './value-objects/exp-date.value-object';
import { InitialQuantity } from './value-objects/initial-quantity.value-object';
import { LotNo } from './value-objects/lot-no.value-object';
import { MfgDate } from './value-objects/mfg-date.value-object';
import { QuantityOnHand } from './value-objects/quantity-on-hand.value-object';
import { StorageTemp } from './value-objects/storage-temp.value-object';
import { VaccineId } from './value-objects/vaccine-id.value-object';
import { VaccineLotStatus as VaccineLotStatusValue } from './value-objects/vaccine-lot-status.value-object';

interface VaccineLotProps {
  vaccineId: VaccineId;
  lotNo: LotNo;
  mfgDate: MfgDate;
  expDate: ExpDate;
  initialQuantity: InitialQuantity;
  quantityOnHand: QuantityOnHand;
  storageTemp: StorageTemp;
  status: VaccineLotStatusValue;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface VaccineLotInput {
  vaccineId: string;
  lotNo: string;
  mfgDate: Date;
  expDate: Date;
  initialQuantity: number;
  quantityOnHand: number;
  storageTempMin: number;
  storageTempMax: number;
  status: VaccineLotStatus;
}

interface VaccineLotReconstitute extends VaccineLotInput {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class VaccineLotEntity {
  private readonly _id: string;
  private _props: VaccineLotProps;

  private constructor(id: string, props: VaccineLotProps) {
    this._id = id;
    this._props = props;
  }

  static create(id: string, input: VaccineLotInput): VaccineLotEntity {
    const now = new Date();

    return new VaccineLotEntity(id, {
      vaccineId: VaccineId.create(input.vaccineId),
      lotNo: LotNo.create(input.lotNo),
      mfgDate: MfgDate.create(input.mfgDate, { expDate: input.expDate }),
      expDate: ExpDate.create(input.expDate, { mfgDate: input.mfgDate }),
      initialQuantity: InitialQuantity.create(input.initialQuantity, input.quantityOnHand),
      quantityOnHand: QuantityOnHand.create(input.quantityOnHand, input.initialQuantity),
      storageTemp: StorageTemp.create(input.storageTempMin, input.storageTempMax),
      status: VaccineLotStatusValue.create(input.status),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(id: string, input: VaccineLotReconstitute): VaccineLotEntity {
    return new VaccineLotEntity(id, {
      vaccineId: VaccineId.create(input.vaccineId),
      lotNo: LotNo.create(input.lotNo),
      mfgDate: MfgDate.create(input.mfgDate, { expDate: input.expDate, allowFuture: true }),
      expDate: ExpDate.create(input.expDate, { mfgDate: input.mfgDate, allowExpired: true }),
      initialQuantity: InitialQuantity.create(input.initialQuantity, input.quantityOnHand),
      quantityOnHand: QuantityOnHand.create(input.quantityOnHand, input.initialQuantity),
      storageTemp: StorageTemp.create(input.storageTempMin, input.storageTempMax),
      status: VaccineLotStatusValue.create(input.status),
      isDeleted: input.isDeleted,
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      deletedAt: input.deletedAt ? new Date(input.deletedAt) : null,
    });
  }

  get id(): string {
    return this._id;
  }

  get vaccineId(): string {
    return this._props.vaccineId.value;
  }

  get lotNo(): string {
    return this._props.lotNo.value;
  }

  get mfgDate(): Date {
    return this._props.mfgDate.value;
  }

  get expDate(): Date {
    return this._props.expDate.value;
  }

  get initialQuantity(): number {
    return this._props.initialQuantity.value;
  }

  get quantityOnHand(): number {
    return this._props.quantityOnHand.value;
  }

  get storageTempMin(): number {
    return this._props.storageTemp.min;
  }

  get storageTempMax(): number {
    return this._props.storageTemp.max;
  }

  get status(): VaccineLotStatus {
    return this._props.status.value;
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

  update(input: Partial<VaccineLotInput>): void {
    if (this._props.isDeleted) {
      throw new VaccineLotDeletedError(this.id);
    }

    const nextMfgDate = input.mfgDate ?? this.mfgDate;
    const nextExpDate = input.expDate ?? this.expDate;
    const nextInitialQuantity = input.initialQuantity ?? this.initialQuantity;
    const nextQuantityOnHand = input.quantityOnHand ?? this.quantityOnHand;
    const nextStorageTempMin = input.storageTempMin ?? this.storageTempMin;
    const nextStorageTempMax = input.storageTempMax ?? this.storageTempMax;

    if (input.vaccineId !== undefined) {
      this._props.vaccineId = VaccineId.create(input.vaccineId);
    }
    if (input.lotNo !== undefined) {
      this._props.lotNo = LotNo.create(input.lotNo);
    }
    if (input.mfgDate !== undefined || input.expDate !== undefined) {
      this._props.mfgDate = MfgDate.create(nextMfgDate, { expDate: nextExpDate });
      this._props.expDate = ExpDate.create(nextExpDate, { mfgDate: nextMfgDate });
    }
    if (input.initialQuantity !== undefined || input.quantityOnHand !== undefined) {
      this._props.initialQuantity = InitialQuantity.create(nextInitialQuantity, nextQuantityOnHand);
      this._props.quantityOnHand = QuantityOnHand.create(nextQuantityOnHand, nextInitialQuantity);
    }
    if (input.storageTempMin !== undefined || input.storageTempMax !== undefined) {
      this._props.storageTemp = StorageTemp.create(nextStorageTempMin, nextStorageTempMax);
    }
    if (input.status !== undefined) {
      this._props.status = VaccineLotStatusValue.create(input.status);
    }

    this._props.updatedAt = new Date();
  }

  softDelete(): void {
    if (this._props.isDeleted) {
      throw new VaccineLotDeletedError(this.id);
    }

    this._props.isDeleted = true;
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }
}
