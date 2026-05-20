import { Injectable } from '@nestjs/common';
import { Meta } from '@/shared/application/response.dto';
import { PetModel } from '../model/pet.model';
import { PetQueryPort } from '../ports/pet.query.port';
import { FindPetOptions } from '../ports/pet.repository.port';

interface GetPetsResult {
  items: PetModel[];
  meta: Meta;
}

@Injectable()
export class GetPetsUseCase {
  constructor(private readonly petQuery: PetQueryPort) {}

  async getById(id: string): Promise<PetModel> {
    return this.petQuery.findById(id);
  }

  async getMany(options: FindPetOptions): Promise<GetPetsResult> {
    const { items, totalItems } = await this.petQuery.findMany(options);
    const totalPages = options.limit > 0 ? Math.ceil(totalItems / options.limit) : 0;

    return {
      items,
      meta: {
        page: options.page,
        limit: options.limit,
        total: totalItems,
        totalPages,
      },
    };
  }
}
