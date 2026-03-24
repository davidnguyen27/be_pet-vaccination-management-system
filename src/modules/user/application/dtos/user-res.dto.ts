import { OwnerResponseDto } from '@/modules/owner/application/dtos/owner-res.dto';
import { StaffResponseDto } from '@/modules/staff/application/dtos/staff-res.dto';
import { VetResponseDto } from '@/modules/vet/application/dtos/vet-res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  roleCode!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ nullable: true })
  fullName!: string | null;

  @ApiProperty({ nullable: true })
  phoneNumber!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ nullable: true })
  dob!: Date | null;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty({ nullable: true })
  lastLoginAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ type: () => OwnerResponseDto, nullable: true })
  owner!: OwnerResponseDto | null;

  @ApiProperty({ type: () => VetResponseDto, nullable: true })
  vet!: VetResponseDto | null;

  @ApiProperty({ type: () => StaffResponseDto, nullable: true })
  staff!: StaffResponseDto | null;

  constructor(data: Partial<UserResponseDto>) {
    Object.assign(this, data);
  }
}
