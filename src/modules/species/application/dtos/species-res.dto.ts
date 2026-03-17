import { ApiProperty } from '@nestjs/swagger';

export class SpeciesResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  defaultVaccinePlan!: boolean;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt!: Date | null;

  constructor(data: Partial<SpeciesResponseDto>) {
    Object.assign(this, data);
  }
}
