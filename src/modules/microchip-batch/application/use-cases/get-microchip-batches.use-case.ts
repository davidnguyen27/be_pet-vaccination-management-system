import { Meta } from '@/shared/application/response.dto';
import { Injectable } from '@nestjs/common';
import { MicrochipBatchModel } from '../model/microchip-batch.model';
import { MicrochipBatchQueryPort } from '../ports/microchip-batch.query.port';
import { FindMicrochipBatchOptions } from '../ports/microchip-batch.repository.port';

interface GetMicrochipBatchesResult {
  items: MicrochipBatchModel[];
  meta: Meta;
}

@Injectable()
export class GetMicrochipBatchesUseCase {
  constructor(private readonly microchipBatchQuery: MicrochipBatchQueryPort) {}

  async getById(id: string): Promise<MicrochipBatchModel> {
    return this.microchipBatchQuery.findById(id);
  }

  async getMany(options: FindMicrochipBatchOptions): Promise<GetMicrochipBatchesResult> {
    const { items, totalItems } = await this.microchipBatchQuery.findMany(options);
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
