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

export class StaffResponseDTO {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty({ type: () => UserResponseDTO, nullable: true })
  @Expose()
  @Type(() => UserResponseDTO)
  user!: UserResponseDTO | null;

  @ApiProperty()
  @Expose()
  code!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  jobTitle?: string | null;

  @ApiProperty({ nullable: true })
  @Expose()
  department?: string | null;

  @ApiProperty()
  @Expose()
  employmentType!: string;

  @ApiProperty()
  @Expose()
  employmentStatus!: string;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  joinDate!: Date;

  @ApiProperty({ nullable: true })
  @Expose()
  @Type(() => Date)
  endDate?: Date | null;

  @ApiProperty()
  @Expose()
  address!: string;

  @ApiProperty()
  @Expose()
  citizenId!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  notes?: string | null;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;
}
