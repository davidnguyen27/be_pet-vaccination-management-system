import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PetRequestDto {
  @ApiProperty({ example: 'Buddy' })
  @IsNotEmpty({ message: 'Name is required!' })
  name!: string;

  @ApiProperty({ example: 'Male' })
  @IsNotEmpty({ message: 'Sex is required!' })
  sex!: string;

  @ApiProperty({ example: '2015-06-01' })
  @IsNotEmpty({ message: 'Date of birth is required!' })
  dob!: Date;

  @ApiProperty({ example: 10 })
  @IsNotEmpty({ message: 'Weight is required!' })
  weight!: number;

  @ApiProperty({ example: 'Brown' })
  @IsNotEmpty({ message: 'Color is required!' })
  color!: string;

  @ApiProperty({ example: 'Golden Retriever' })
  @IsNotEmpty({ message: 'Breed is required!' })
  breed!: string;

  @ApiProperty({ example: 'Friendly and energetic' })
  note!: string | null;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: 'Sterilization status is required!' })
  isSterilized!: boolean;
}
