import { MicrochipBatchModel } from '../model/microchip-batch.model';
import { FindMicrochipBatchOptions, PaginatedResult } from './microchip-batch.repository.port';

export abstract class MicrochipBatchQueryPort {
  abstract findById(id: string): Promise<MicrochipBatchModel>;
  abstract findMany(options: FindMicrochipBatchOptions): Promise<PaginatedResult<MicrochipBatchModel>>;
}
