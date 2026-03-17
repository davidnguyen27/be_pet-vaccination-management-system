import { employment_status, employment_type } from '@/enums';
import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StaffResponseDto {
  @ApiProperty()
  profileId!: string;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty()
  code!: string;

  @ApiProperty({ nullable: true })
  jobTitle!: string | null;

  @ApiProperty({ nullable: true })
  department!: string | null;

  @ApiProperty({ enum: employment_type })
  employmentType!: employment_type;

  @ApiProperty({ enum: employment_status })
  employmentStatus!: employment_status;

  @ApiProperty()
  joinDate!: Date;

  @ApiProperty({ nullable: true })
  endDate!: Date | null;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  citizenId!: string;

  @ApiProperty({ nullable: true })
  notes!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: Partial<StaffResponseDto>) {
    Object.assign(this, data);
  }
}
