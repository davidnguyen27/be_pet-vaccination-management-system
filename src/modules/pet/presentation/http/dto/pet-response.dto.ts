import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class UserResponseDTO {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  role!: string;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  fullName!: string | null;

  @ApiProperty({ nullable: true })
  @Expose()
  phoneNumber!: string | null;

  @ApiProperty({ nullable: true })
  @Expose()
  avatarUrl!: string | null;

  @ApiProperty({ nullable: true })
  @Expose()
  dob!: string | null;
}

class OwnerResponseDTO {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty({ type: () => UserResponseDTO, nullable: true })
  @Expose()
  @Type(() => UserResponseDTO)
  user!: UserResponseDTO | null;

  @ApiProperty({ nullable: true })
  @Expose()
  address!: string | null;

  @ApiProperty({ nullable: true })
  @Expose()
  locationLat!: number | null;

  @ApiProperty({ nullable: true })
  @Expose()
  locationLng!: number | null;

  @ApiProperty()
  @Expose()
  totalPoints!: number;
}

export class PetResponseDTO {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty({ type: () => OwnerResponseDTO, nullable: true })
  @Expose()
  @Type(() => OwnerResponseDTO)
  owner!: OwnerResponseDTO | null;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  species!: string;

  @ApiProperty()
  @Expose()
  sex!: string;

  @ApiProperty()
  @Expose()
  dob!: Date;

  @ApiProperty()
  @Expose()
  weight!: number;

  @ApiProperty()
  @Expose()
  color!: string;

  @ApiProperty()
  @Expose()
  breed!: string;

  @ApiProperty()
  @Expose()
  note!: string | null;

  @ApiProperty()
  @Expose()
  isSterilized!: boolean;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  @ApiProperty()
  @Expose()
  deletedAt!: Date | null;
}
