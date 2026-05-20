import { Injectable } from '@nestjs/common';
import { Meta } from '@/shared/application/response.dto';
import { FindVetOptions } from '../ports/vet.repository.port';
import { VetQueryPort } from '../ports/vet.query.port';
import { VetModel } from '../model/vet.model';

interface GetVetsResult {
  items: VetModel[];
  meta: Meta;
}

@Injectable()
export class GetVetsUseCase {
  constructor(private readonly vetQuery: VetQueryPort) {}

  async getByUserId(userId: string): Promise<VetModel> {
    const vet = await this.vetQuery.findByUserId(userId);
    return vet;
  }

  async getMany(options: FindVetOptions): Promise<GetVetsResult> {
    const { items, totalItems } = await this.vetQuery.findMany(options);
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
