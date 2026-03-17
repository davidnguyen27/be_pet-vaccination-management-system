import { OwnerEntity } from './owner.entity';

export const I_OWNER_REPOSITORY = Symbol('IOwnerRepository');

export interface GetOwnersFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface UpdateOwnerData {
  id: string;
  address?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IOwnerRepository {
  findAll(filter: GetOwnersFilter): Promise<PaginatedResult<OwnerEntity>>;
  findById(id: string): Promise<OwnerEntity | null>;
  findByUserId(userId: string): Promise<OwnerEntity | null>;
  update(data: UpdateOwnerData): Promise<OwnerEntity>;
}
