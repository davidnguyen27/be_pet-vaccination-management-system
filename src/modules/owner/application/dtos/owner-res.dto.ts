import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OwnerResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => UserResponseDto, nullable: true })
  user!: UserResponseDto | null;

  @ApiProperty({ nullable: true })
  address!: string | null;

  @ApiProperty({ nullable: true })
  locationLat!: number | null;

  @ApiProperty({ nullable: true })
  locationLng!: number | null;

  @ApiProperty()
  totalPoints!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: Partial<OwnerResponseDto>) {
    Object.assign(this, data);
  }
}
