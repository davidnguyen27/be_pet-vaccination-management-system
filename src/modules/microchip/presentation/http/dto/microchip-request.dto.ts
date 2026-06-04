import { MicrochipStatus } from '@/enums/microchip';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class MicrochipDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  batchId!: string;

  @ApiProperty({ maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  microchipCode!: string;

  @ApiProperty({ enum: MicrochipStatus })
  @IsEnum(MicrochipStatus)
  @IsNotEmpty()
  status!: MicrochipStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsUUID()
  @IsOptional()
  petId?: string | null;
}
