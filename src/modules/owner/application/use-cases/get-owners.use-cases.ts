import { Injectable } from '@nestjs/common';
import { FindOwnerOptions } from '../ports/owner.repository.port';
import { OwnerQueryPort } from '../ports/owner.query.port';
import { Meta } from '@/shared/application/response.dto';
import { OwnerModel } from '../model/owner.model';

interface GetOwnersResult {
  items: OwnerModel[];
  meta: Meta;
}

@Injectable()
export class GetOwnersUseCase {
  constructor(private readonly ownerQuery: OwnerQueryPort) {}

  async getById(id: string): Promise<OwnerModel> {
    const owner = await this.ownerQuery.findByUserId(id);
    return owner;
  }

  async getMany(options: FindOwnerOptions): Promise<GetOwnersResult> {
    const { items, totalItems } = await this.ownerQuery.findMany(options);
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
