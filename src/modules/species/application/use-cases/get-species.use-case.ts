import { Injectable } from '@nestjs/common';
import { Meta } from '@/shared/application/response.dto';
import { SpeciesEntity } from '../../domain/species.entity';
import { FindSpeciesOptions, SpeciesRepositoryPort } from '../ports/species.repository.port';

interface GetSpeciesResult {
  items: SpeciesEntity[];
  meta: Meta;
}

@Injectable()
export class GetSpeciesUseCase {
  constructor(private readonly speciesRepo: SpeciesRepositoryPort) {}

  async getById(id: string) {
    const species = await this.speciesRepo.findByIdOrThrow(id);
    return species;
  }

  async getMany(options: FindSpeciesOptions): Promise<GetSpeciesResult> {
    const { items, total } = await this.speciesRepo.findMany(options);
    return {
      items,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }
}
