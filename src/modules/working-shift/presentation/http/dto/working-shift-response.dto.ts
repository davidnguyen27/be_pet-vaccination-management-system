import { ApiProperty } from '@nestjs/swagger';
import { Weekday } from '../../../domain/working-shift.types';

class WorkingShiftVetResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ nullable: true })
  fullName!: string | null;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  phoneNumber!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  licenseNo!: string;

  @ApiProperty()
  employmentStatus!: string;
}

export class WorkingShiftResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: WorkingShiftVetResponseDTO })
  vet!: WorkingShiftVetResponseDTO;

  @ApiProperty({ enum: Weekday })
  dayOfWeek!: Weekday;

  @ApiProperty()
  startTime!: Date;

  @ApiProperty()
  endTime!: Date;

  @ApiProperty()
  slotDuration!: number;

  @ApiProperty()
  maxAppointments!: number;

  @ApiProperty({ nullable: true })
  notes!: string | null;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
