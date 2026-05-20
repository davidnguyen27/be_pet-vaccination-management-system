import { VaccineStatus } from '@/enums/vaccine';
import { ApiProperty } from '@nestjs/swagger';

export class VaccineResponseDTO {
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

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
