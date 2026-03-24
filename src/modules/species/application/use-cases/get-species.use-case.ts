import { Inject, Injectable } from '@nestjs/common';
import { I_SPECIES_REPOSITORY, I_SpeciesRepository } from '../../domain/i-species.repository';
import { BaseQueryDto } from '@/shared/application/base-query.dto';
import { SpeciesResponseDto } from '../dtos/species-res.dto';
import { SpeciesMapper } from '../../infrastructure/species.mapper';
import { PaginationDto } from '@/shared/application/pagination.dto';

@Injectable()
export class GetSpeciesUseCase {
  constructor(@Inject(I_SPECIES_REPOSITORY) private readonly speciesRepo: I_SpeciesRepository) {}

  async execute(query: BaseQueryDto): Promise<PaginationDto<SpeciesResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.speciesRepo.findAll({
      page,
      limit,
      search: query.search,
    });

    const species = result.data.map(specie => SpeciesMapper.toResponse(specie));

    return new PaginationDto(species, {
      total: result.total,
      page,
      limit,
    });
  }
}
