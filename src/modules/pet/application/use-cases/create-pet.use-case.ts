import { Inject, Injectable } from '@nestjs/common';
import { PetDto } from '../dtos/pet-req.dto';
import { PetResponseDto } from '../dtos/pet-res.dto';
import { I_PET_REPOSITORY, IPetRepository } from '../../domain/i-pet.entity';
import { PetMapper } from '../../infrastructure/pet.mapper';

@Injectable()
export class CreatePetUseCase {
  constructor(@Inject(I_PET_REPOSITORY) private readonly petRepo: IPetRepository) {}

  async execute(dto: PetDto): Promise<PetResponseDto> {
    const pet = await this.petRepo.create({
      ownerId: dto.ownerId,
      speciesId: dto.speciesId,
      name: dto.name,
      sex: dto.sex,
      dob: dto.dob,
      weight: dto.weight,
      color: dto.color,
      breed: dto.breed,
      note: dto.note ?? null,
      isSterilized: dto.isSterilized,
    });

    return PetMapper.toResponse(pet);
  }
}
