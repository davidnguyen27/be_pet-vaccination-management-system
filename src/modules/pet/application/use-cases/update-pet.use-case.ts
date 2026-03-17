import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PetResponseDto } from '../dtos/pet-res.dto';
import { UpdatePetDto } from '../dtos/pet-update.dto';
import { I_PET_REPOSITORY, IPetRepository } from '../../domain/i-pet.entity';
import { PetMapper } from '../../infrastructure/pet.mapper';

@Injectable()
export class UpdatePetUseCase {
  constructor(@Inject(I_PET_REPOSITORY) private readonly petRepo: IPetRepository) {}

  async execute(petId: string, dto: UpdatePetDto): Promise<PetResponseDto> {
    const existing = await this.petRepo.findById(petId);
    if (!existing) {
      throw new NotFoundException('Pet not found');
    }

    const updated = await this.petRepo.update({
      id: petId,
      ownerId: dto.ownerId,
      speciesId: dto.speciesId,
      name: dto.name,
      sex: dto.sex,
      dob: dto.dob,
      weight: dto.weight,
      color: dto.color,
      breed: dto.breed,
      note: dto.note,
      isSterilized: dto.isSterilized,
    });

    return PetMapper.toResponse(updated);
  }
}
