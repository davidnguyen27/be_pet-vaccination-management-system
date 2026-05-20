import { PaginatedResult } from './owner.repository.port';
import { FindOwnerOptions } from './owner.repository.port';
import { OwnerModel } from '../model/owner.model';

export abstract class OwnerQueryPort {
  abstract findByUserId(userId: string): Promise<OwnerModel>;
  abstract findMany(options: FindOwnerOptions): Promise<PaginatedResult<OwnerModel>>;
}
