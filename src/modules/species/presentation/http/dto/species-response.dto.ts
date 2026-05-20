import { ApiProperty } from '@nestjs/swagger';

export class SpeciesResponseDTO {
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
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiProperty()
  deletedAt!: string | null;
}
