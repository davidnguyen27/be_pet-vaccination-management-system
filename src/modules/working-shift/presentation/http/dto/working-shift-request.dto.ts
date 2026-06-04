import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { Weekday } from '../../../domain/working-shift.types';

export class WorkingShiftRequestDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  vetId!: string;

  @ApiProperty({ enum: Weekday })
  @IsEnum(Weekday)
  @IsNotEmpty()
  dayOfWeek!: Weekday;

  @ApiProperty({ type: String, format: 'date-time', example: '1970-01-01T08:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startTime!: Date;

  @ApiProperty({ type: String, format: 'date-time', example: '1970-01-01T17:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endTime!: Date;

  @ApiProperty({ default: 30, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  slotDuration!: number;

  @ApiProperty({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  maxAppointments!: number;

  @ApiPropertyOptional({ nullable: true, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  notes?: string | null;
}
