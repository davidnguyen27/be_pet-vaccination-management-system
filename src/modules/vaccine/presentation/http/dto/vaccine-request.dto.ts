import { VaccineStatus } from '@/enums/vaccine';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class VaccineDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  speciesId!: string;

  @ApiProperty()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  brand!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  imgUrl?: Express.Multer.File;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  doseValue!: number;

  @ApiProperty()
  @IsNotEmpty()
  doseUnit!: string;

  @ApiProperty()
  @IsEnum(VaccineStatus)
  @IsNotEmpty()
  status!: VaccineStatus;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  defaultTotalDoses!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  defaultNextDueDays!: number;
}
