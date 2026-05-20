import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDTO {
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

  @ApiProperty()
  @Expose()
  lastLoginAt!: string | null;

  @ApiProperty()
  @Expose()
  createdAt!: string;

  @ApiProperty()
  @Expose()
  updatedAt!: string;

  @ApiProperty()
  @Expose()
  deletedAt?: string | null;
}
