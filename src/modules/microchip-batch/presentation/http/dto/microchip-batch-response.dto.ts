import { ApiProperty } from '@nestjs/swagger';

export class MicrochipBatchResponseDTO {
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

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
