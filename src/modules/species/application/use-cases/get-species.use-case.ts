import { Inject, Injectable } from '@nestjs/common';
import { I_SPECIES_REPOSITORY, I_SpeciesRepository } from '../../domain/i-species.repository';
import { BaseQueryDto } from '@/shared/application/base-query.dto';
import { PaginatedResult } from '@/modules/user/domain/i-user.repository';
import { SpeciesResponseDto } from '../dtos/species-res.dto';
import { SpeciesMapper } from '../../infrastructure/species.mapper';

@Injectable()
export class GetSpeciesUseCase {
  constructor(@Inject(I_SPECIES_REPOSITORY) private readonly speciesRepo: I_SpeciesRepository) {}

  async execute(query: BaseQueryDto): Promise<PaginatedResult<SpeciesResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.speciesRepo.findAll({
      page,
      limit,
      search: query.search,
    });

    const species = result.data.map(specie => SpeciesMapper.toResponse(specie));

    return {
      data: species,
      total: result.total,
      page,
      limit,
    };
  }
}
