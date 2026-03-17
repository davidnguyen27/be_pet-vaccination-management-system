import { PartialType } from '@nestjs/swagger';
import { PetRequestDto } from './pet-req.dto';

export class UpdatePetDto extends PartialType(PetRequestDto) {}
