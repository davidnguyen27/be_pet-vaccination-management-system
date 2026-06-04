import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class MicrochipBatchDTO {
  @ApiProperty({ maxLength: 80 })
  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  batchNo!: string;

  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  vendorName!: string;

  @ApiProperty({ maxLength: 150 })
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  manufacturer!: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  model!: string;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  importDate!: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  totalQuantity!: number;

  @ApiPropertyOptional({ nullable: true, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  notes?: string | null;
}
