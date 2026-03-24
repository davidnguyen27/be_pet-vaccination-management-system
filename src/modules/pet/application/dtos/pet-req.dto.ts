import { PetGender } from '@/enums/pet';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PetDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  ownerId!: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  speciesId!: string;

  @ApiProperty({ example: 'Buddy' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required!' })
  name!: string;

  @ApiProperty({ enum: PetGender, example: PetGender.MALE })
  @IsEnum(PetGender)
  @IsNotEmpty({ message: 'Sex is required!' })
  sex!: PetGender;

  @ApiProperty({ example: '2015-06-01' })
  @IsDate()
  @IsNotEmpty({ message: 'Date of birth is required!' })
  dob!: Date;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Weight is required!' })
  weight!: number;

  @ApiProperty({ example: 'Brown' })
  @IsString()
  @IsNotEmpty({ message: 'Color is required!' })
  color!: string;

  @ApiProperty({ example: 'Golden Retriever' })
  @IsString()
  @IsNotEmpty({ message: 'Breed is required!' })
  breed!: string;

  @ApiProperty({ example: 'Friendly and energetic', required: false, nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty({ message: 'Sterilization status is required!' })
  isSterilized!: boolean;
}
