import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SpeciesDTO {
  @ApiProperty({ example: 'DOG' })
  @IsString()
  @IsNotEmpty({ message: 'Code is required!' })
  code!: string;

  @ApiProperty({ example: 'Dog' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required!' })
  name!: string;

  @ApiProperty()
  @IsBoolean()
  defaultVaccinePlan!: boolean;
}
