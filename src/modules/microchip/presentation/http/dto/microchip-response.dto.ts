import { MicrochipStatus } from '@/enums/microchip';
import { ApiProperty } from '@nestjs/swagger';

class MicrochipBatchResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  batchNo!: string;

  @ApiProperty()
  vendorName!: string;

  @ApiProperty()
  manufacturer!: string;

  @ApiProperty()
  model!: string;

  @ApiProperty()
  importDate!: Date;

  @ApiProperty()
  totalQuantity!: number;

  @ApiProperty({ nullable: true })
  notes!: string | null;

  @ApiProperty()
  isDeleted!: boolean;
}

class MicrochipPetResponseDTO {
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

export class MicrochipResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: MicrochipBatchResponseDTO })
  batch!: MicrochipBatchResponseDTO;

  @ApiProperty()
  microchipCode!: string;

  @ApiProperty({ enum: MicrochipStatus })
  status!: MicrochipStatus;

  @ApiProperty({ type: MicrochipPetResponseDTO, nullable: true })
  pet!: MicrochipPetResponseDTO | null;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
