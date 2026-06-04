import { Meta } from '@/shared/application/response.dto';
import { Injectable } from '@nestjs/common';
import { MicrochipModel } from '../model/microchip.model';
import { MicrochipQueryPort } from '../ports/microchip.query.port';
import { FindMicrochipOptions } from '../ports/microchip.repository.port';

interface GetMicrochipsResult {
  items: MicrochipModel[];
  meta: Meta;
}

@Injectable()
export class GetMicrochipsUseCase {
  constructor(private readonly microchipQuery: MicrochipQueryPort) {}

  async getById(id: string): Promise<MicrochipModel> {
    return this.microchipQuery.findById(id);
  }

  async getMany(options: FindMicrochipOptions): Promise<GetMicrochipsResult> {
    const { items, totalItems } = await this.microchipQuery.findMany(options);
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
