import { VetModel } from '../model/vet.model';
import { FindVetOptions, PaginatedResult } from './vet.repository.port';

export abstract class VetQueryPort {
  abstract findByUserId(userId: string): Promise<VetModel>;
  abstract findMany(options: FindVetOptions): Promise<PaginatedResult<VetModel>>;
}
