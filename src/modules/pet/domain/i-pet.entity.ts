import { PetGender } from '@/enums/pet';
import { PetEntity } from './pet.entity';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';
import { Params } from '@/shared/domain/query-params.type';
import { Species } from '@/enums/species';

export const I_PET_REPOSITORY = Symbol('IPetRepository');

export interface CreatePetData {
  ownerId: string;
  speciesId: string;
  name: string;
  sex: PetGender;
  dob: Date;
  weight: number;
  color: string;
  breed: string;
  note: string | null;
  isSterilized: boolean;
}

export interface UpdatePetData {
  id: string;
  ownerId?: string;
  speciesId?: string;
  name?: string;
  sex?: PetGender;
  dob?: Date;
  weight?: number;
  color?: string;
  breed?: string;
  note?: string | null;
  isSterilized?: boolean;
}

export interface PetParams extends Params {
  species?: Species;
}

export interface IPetRepository {
  findAll(params: PetParams): Promise<PaginatedResult<PetEntity>>;
  findById(id: string): Promise<PetEntity | null>;
  create(data: CreatePetData): Promise<PetEntity>;
  update(data: UpdatePetData): Promise<PetEntity>;
  delete(id: string): Promise<void>;
}
