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

export class VetResponseDTO {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty({ type: () => UserResponseDTO, nullable: true })
  @Expose()
  @Type(() => UserResponseDTO)
  user!: UserResponseDTO | null;

  @ApiProperty()
  @Expose()
  bio!: string;

  @ApiProperty()
  @Expose()
  licenseNo!: string;

  @ApiProperty()
  @Expose()
  licenseIssueBy!: string;

  @ApiProperty()
  @Expose()
  licenseValidFrom!: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  licenseValidTo!: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  joinDate!: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  endDate?: Date | null;

  @ApiProperty()
  @Expose()
  address!: string;

  @ApiProperty()
  @Expose()
  citizenId!: string;

  @ApiProperty()
  @Expose()
  employmentStatus!: string;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
