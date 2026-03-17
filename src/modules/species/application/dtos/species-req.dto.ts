import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SpeciesDto {
  @ApiProperty({ example: 'DOG' })
  @IsString()
  @MaxLength(10)
  code!: string;

  @ApiProperty({ example: 'Dog' })
  @IsString()
  @MaxLength(10)
  name!: string;

  @ApiProperty()
  defaultVaccinePlan!: boolean;
}
