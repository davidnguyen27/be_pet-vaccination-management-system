import { PaginationDto } from '@/shared/application/pagination.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PetQueryDto } from '../dtos/pet-query.dto';
import { PetResponseDto } from '../dtos/pet-res.dto';
import { I_PET_REPOSITORY, IPetRepository } from '../../domain/i-pet.entity';
import { PetMapper } from '../../infrastructure/pet.mapper';

@Injectable()
export class GetAllPetsUseCase {
  constructor(@Inject(I_PET_REPOSITORY) private readonly petRepo: IPetRepository) {}

  async execute(query: PetQueryDto): Promise<PaginationDto<PetResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.petRepo.findAll({
      page,
      limit,
      search: query.search,
      species: query.species,
    });

    const pets = result.data.map(pet => PetMapper.toResponse(pet));

    return new PaginationDto(pets, {
      total: result.total,
      page,
      limit,
    });
  }
}
