import { employment_status } from '@/enums';
import { VetEntity } from './vet.entity';

export const I_VET_REPOSITORY = Symbol('IVetRepository');

export interface GetVetsFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface UpdateVetData {
  id: string;
  bio: string;
  licenseNo: string;
  licenseIssueBy: string;
  licenseValidFrom: Date;
  licenseValidTo: Date;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  employmentStatus: employment_status;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IVetRepository {
  findAll(filter: GetVetsFilter): Promise<PaginatedResult<VetEntity>>;
  findById(id: string): Promise<VetEntity | null>;
  findByUserId(userId: string): Promise<VetEntity | null>;
  update(data: UpdateVetData): Promise<VetEntity>;
}
