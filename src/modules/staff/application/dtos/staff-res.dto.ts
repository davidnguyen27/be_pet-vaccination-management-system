import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StaffResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty()
  code!: string;

  @ApiProperty({ nullable: true })
  jobTitle!: string | null;

  @ApiProperty({ nullable: true })
  department!: string | null;

  @ApiProperty()
  employmentType!: string;

  @ApiProperty()
  employmentStatus!: string;

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
