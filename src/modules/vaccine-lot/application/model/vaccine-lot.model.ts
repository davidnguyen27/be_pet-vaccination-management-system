import { VaccineLotStatus, VaccineStatus } from '@/enums/vaccine';

export interface VaccineLotModel {
  id: string;
  vaccine: {
    id: string;
    species: string;
    code: string;
    name: string;
    brand: string;
    imgUrl: string | null;
    description: string | null;
    doseValue: number;
    doseUnit: string;
    status: VaccineStatus;
    defaultTotalDoses: number;
    defaultNextDueDays: number;
  };
  lotNo: string;
  mfgDate: Date;
  expDate: Date;
  initialQuantity: number;
  quantityOnHand: number;
  storageTempMin: number;
  storageTempMax: number;
  status: VaccineLotStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
