import { VaccinePlanStatus, VaccineStatus } from '@/enums/vaccine';
import { ApiProperty } from '@nestjs/swagger';

class VaccinePlanPetResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  species!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  sex!: string;

  @ApiProperty()
  dob!: Date;

  @ApiProperty()
  weight!: number;

  @ApiProperty()
  color!: string;

  @ApiProperty()
  breed!: string;

  @ApiProperty({ nullable: true })
  note!: string | null;

  @ApiProperty()
  isSterilized!: boolean;
}

class VaccinePlanVaccineResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  species!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  brand!: string;

  @ApiProperty({ nullable: true })
  imgUrl!: string | null;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty()
  doseValue!: number;

  @ApiProperty()
  doseUnit!: string;

  @ApiProperty({ enum: VaccineStatus })
  status!: VaccineStatus;

  @ApiProperty()
  defaultTotalDoses!: number;

  @ApiProperty()
  defaultNextDueDays!: number;
}

class VaccinePlanVaccinationRecordResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  doseNo!: number;

  @ApiProperty()
  administeredAt!: Date;

  @ApiProperty()
  status!: string;

  @ApiProperty({ nullable: true })
  nextDueDate!: Date | null;
}

export class VaccinePlanResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: VaccinePlanPetResponseDTO })
  pet!: VaccinePlanPetResponseDTO;

  @ApiProperty({ type: VaccinePlanVaccineResponseDTO })
  vaccine!: VaccinePlanVaccineResponseDTO;

  @ApiProperty()
  doseNo!: number;

  @ApiProperty()
  dueDate!: Date;

  @ApiProperty({ nullable: true })
  dueFrom!: Date | null;

  @ApiProperty({ nullable: true })
  dueTo!: Date | null;

  @ApiProperty({ enum: VaccinePlanStatus })
  status!: VaccinePlanStatus;

  @ApiProperty({ type: VaccinePlanVaccinationRecordResponseDTO, nullable: true })
  vaccinationRecord!: VaccinePlanVaccinationRecordResponseDTO | null;

  @ApiProperty({ nullable: true })
  completedAt!: Date | null;

  @ApiProperty({ nullable: true })
  remindAt!: Date | null;

  @ApiProperty({ nullable: true })
  lastRemindedAt!: Date | null;

  @ApiProperty({ nullable: true })
  note!: string | null;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
