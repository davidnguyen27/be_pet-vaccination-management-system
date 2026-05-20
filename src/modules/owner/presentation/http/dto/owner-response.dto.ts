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

  @ApiProperty()
  @Expose()
  fullName?: string | null;

  @ApiProperty()
  @Expose()
  phoneNumber?: string | null;

  @ApiProperty()
  @Expose()
  avatarUrl?: string | null;

  @ApiProperty()
  @Expose()
  dob?: string | null;

  @ApiProperty()
  @Expose()
  isActive!: boolean;

  @ApiProperty()
  @Expose()
  isDeleted!: boolean;
}

export class OwnerResponseDTO {
  @ApiProperty()
  @Expose()
  id!: string;

  @Expose()
  @ApiProperty({ type: () => UserResponseDTO, nullable: true })
  @Type(() => UserResponseDTO)
  user?: UserResponseDTO | null;

  @Expose()
  @ApiProperty({ nullable: true })
  address?: string | null;

  @Expose()
  @ApiProperty({ nullable: true })
  locationLat?: number | null;

  @Expose()
  @ApiProperty({ nullable: true })
  locationLng?: number | null;

  @Expose()
  @ApiProperty()
  totalPoints!: number;

  @Expose()
  @ApiProperty()
  createdAt!: string;

  @Expose()
  @ApiProperty()
  updatedAt!: string;
}
