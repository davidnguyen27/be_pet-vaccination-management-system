import { VaccineStatus } from '@/enums/vaccine';

export interface VaccineModel {
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
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
