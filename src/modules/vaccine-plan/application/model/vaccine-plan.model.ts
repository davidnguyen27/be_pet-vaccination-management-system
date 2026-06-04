import { VaccinePlanStatus, VaccineStatus } from '@/enums/vaccine';

export interface VaccinePlanModel {
  id: string;
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
  };
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
  doseNo: number;
  dueDate: Date;
  dueFrom: Date | null;
  dueTo: Date | null;
  status: VaccinePlanStatus;
  vaccinationRecord: {
    id: string;
    doseNo: number;
    administeredAt: Date;
    status: string;
    nextDueDate: Date | null;
  } | null;
  completedAt: Date | null;
  remindAt: Date | null;
  lastRemindedAt: Date | null;
  note: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
