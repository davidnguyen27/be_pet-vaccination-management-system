import { MicrochipStatus } from '@/enums/microchip';
import { MicrochipEntity } from '../../domain/microchip.entity';

export interface FindMicrochipOptions {
  page: number;
  limit: number;
  search?: string;
  batchId?: string;
  petId?: string;
  status?: MicrochipStatus;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class MicrochipRepositoryPort {
  abstract findById(id: string): Promise<MicrochipEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<MicrochipEntity>;
  abstract findByMicrochipCode(microchipCode: string): Promise<MicrochipEntity | null>;
  abstract findMany(options: FindMicrochipOptions): Promise<PaginatedResult<MicrochipEntity>>;
  abstract existsBatch(batchId: string): Promise<boolean>;
  abstract existsPet(petId: string): Promise<boolean>;
  abstract save(microchip: MicrochipEntity): Promise<void>;
}
