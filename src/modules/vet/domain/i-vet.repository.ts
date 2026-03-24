import { employment_status } from '@/enums';
import { VetEntity } from './vet.entity';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';
import { Params } from '@/shared/domain/query-params.type';
export type { PaginatedResult } from '@/shared/domain/paginated-result.type';

export const I_VET_REPOSITORY = Symbol('IVetRepository');

export interface UpdateVetData {
  userId: string;
  bio?: string;
  licenseNo?: string;
  licenseIssueBy?: string;
  licenseValidFrom?: Date;
  licenseValidTo?: Date;
  joinDate?: Date;
  endDate?: Date | null;
  address?: string;
  citizenId?: string;
  employmentStatus?: employment_status;
}

export interface IVetRepository {
  findAll(params: Params): Promise<PaginatedResult<VetEntity>>;
  findById(id: string): Promise<VetEntity | null>;
  findByUserId(userId: string): Promise<VetEntity | null>;
  update(data: UpdateVetData): Promise<VetEntity>;
}
