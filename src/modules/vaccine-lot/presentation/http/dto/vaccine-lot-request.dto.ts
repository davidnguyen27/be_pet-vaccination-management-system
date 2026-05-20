import { VaccineLotStatus } from '@/enums/vaccine';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class VaccineLotDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  vaccineId!: string;

  @ApiProperty()
  @IsNotEmpty()
  lotNo!: string;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  mfgDate!: Date;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  expDate!: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  initialQuantity!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantityOnHand!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  storageTempMin!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  storageTempMax!: number;

  @ApiProperty({ enum: VaccineLotStatus })
  @IsEnum(VaccineLotStatus)
  @IsNotEmpty()
  status!: VaccineLotStatus;
}
