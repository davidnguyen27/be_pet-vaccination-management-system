import { MicrochipModel } from '../model/microchip.model';
import { FindMicrochipOptions, PaginatedResult } from './microchip.repository.port';

export abstract class MicrochipQueryPort {
  abstract findById(id: string): Promise<MicrochipModel>;
  abstract findMany(options: FindMicrochipOptions): Promise<PaginatedResult<MicrochipModel>>;
}
