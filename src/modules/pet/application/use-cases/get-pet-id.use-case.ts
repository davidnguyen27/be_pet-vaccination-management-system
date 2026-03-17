import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_PET_REPOSITORY, IPetRepository } from '../../domain/i-pet.entity';
import { PetResponseDto } from '../dtos/pet-res.dto';
import { PetMapper } from '../../infrastructure/pet.mapper';

@Injectable()
export class GetPetIdUseCase {
  constructor(@Inject(I_PET_REPOSITORY) private readonly petRepo: IPetRepository) {}

  async execute(petId: string): Promise<PetResponseDto> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new NotFoundException('Pet not found');
    return PetMapper.toResponse(pet);
  }
}
