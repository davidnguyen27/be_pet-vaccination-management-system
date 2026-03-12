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

  constructor(data: Partial<UserResponseDto>) {
    Object.assign(this, data);
  }
}
