import { VaccinePlanStatus } from '@/enums/vaccine';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class VaccinePlanDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  petId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  vaccineId!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  doseNo!: number;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dueDate!: Date;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueFrom?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date', nullable: true })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueTo?: Date | null;

  @ApiProperty({ enum: VaccinePlanStatus })
  @IsEnum(VaccinePlanStatus)
  @IsNotEmpty()
  status!: VaccinePlanStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsUUID()
  @IsOptional()
  vaccinationRecordId?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  completedAt?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  remindAt?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  lastRemindedAt?: Date | null;

  @ApiPropertyOptional({ nullable: true, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  note?: string | null;
}
