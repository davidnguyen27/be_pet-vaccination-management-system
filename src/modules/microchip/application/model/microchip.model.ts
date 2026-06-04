import { MicrochipStatus } from '@/enums/microchip';

export interface MicrochipModel {
  id: string;
  batch: {
    id: string;
    batchNo: string;
    vendorName: string;
    manufacturer: string;
    model: string;
    importDate: Date;
    totalQuantity: number;
    notes: string | null;
    isDeleted: boolean;
  };
  microchipCode: string;
  status: MicrochipStatus;
  pet: {
    id: string;
    species: string;
    name: string;
    sex: string;
    dob: Date;
    weight: number;
    color: string;
    breed: string;
    note: string | null;
    isSterilized: boolean;
  } | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
