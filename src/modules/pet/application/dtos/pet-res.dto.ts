import { ApiProperty } from '@nestjs/swagger';
import { OwnerResponseDto } from '@/modules/owner/application/dtos/owner-res.dto';

export class PetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  ownerId!: string;

  @ApiProperty({ type: () => OwnerResponseDto, nullable: true })
  owner!: OwnerResponseDto | null;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  speciesId!: string;

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

  @ApiProperty()
  note!: string | null;

  @ApiProperty()
  isSterilized!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt!: Date | null;

  constructor(data: Partial<PetResponseDto>) {
    Object.assign(this, data);
  }
}
