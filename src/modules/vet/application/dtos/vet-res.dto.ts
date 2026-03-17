import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class VetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty()
  bio!: string;

  @ApiProperty()
  licenseNo!: string;

  @ApiProperty()
  licenseIssueBy!: string;

  @ApiProperty()
  licenseValidFrom!: Date;

  @ApiProperty()
  licenseValidTo!: Date;

  @ApiProperty()
  joinDate!: Date;

  @ApiProperty()
  endDate!: Date | null;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  citizenId!: string;

  @ApiProperty()
  employmentStatus!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: Partial<VetResponseDto>) {
    Object.assign(this, data);
  }
}
