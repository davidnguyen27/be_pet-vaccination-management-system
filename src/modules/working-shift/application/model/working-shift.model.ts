import { Weekday } from '../../domain/working-shift.types';

export interface WorkingShiftModel {
  id: string;
  vet: {
    id: string;
    userId: string;
    fullName: string | null;
    email: string;
    phoneNumber: string | null;
    avatarUrl: string | null;
    licenseNo: string;
    employmentStatus: string;
  };
  dayOfWeek: Weekday;
  startTime: Date;
  endTime: Date;
  slotDuration: number;
  maxAppointments: number;
  notes: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
