import { MicrochipBatchEntity } from '../../domain/microchip-batch.entity';

export interface FindMicrochipBatchOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class MicrochipBatchRepositoryPort {
  abstract findById(id: string): Promise<MicrochipBatchEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<MicrochipBatchEntity>;
  abstract findByBatchNo(batchNo: string): Promise<MicrochipBatchEntity | null>;
  abstract findMany(options: FindMicrochipBatchOptions): Promise<PaginatedResult<MicrochipBatchEntity>>;
  abstract save(microchipBatch: MicrochipBatchEntity): Promise<void>;
}
