import { VaccineLotStatus, VaccineStatus } from '@/enums/vaccine';
import { ApiProperty } from '@nestjs/swagger';

class VaccineLotVaccineResponseDTO {
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

export class VaccineLotResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: VaccineLotVaccineResponseDTO })
  vaccine!: VaccineLotVaccineResponseDTO;

  @ApiProperty()
  lotNo!: string;

  @ApiProperty()
  mfgDate!: Date;

  @ApiProperty()
  expDate!: Date;

  @ApiProperty()
  initialQuantity!: number;

  @ApiProperty()
  quantityOnHand!: number;

  @ApiProperty()
  storageTempMin!: number;

  @ApiProperty()
  storageTempMax!: number;

  @ApiProperty({ enum: VaccineLotStatus })
  status!: VaccineLotStatus;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
