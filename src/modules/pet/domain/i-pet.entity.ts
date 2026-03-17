import { PetEntity } from './pet.entity';
import { gender } from '../../../../generated/prisma/enums';

export const I_PET_REPOSITORY = Symbol('IPetRepository');

export interface GetPetsFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface CreatePetData {
  ownerId: string;
  speciesId: string;
  name: string;
  sex: gender;
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
  sex?: gender;
  dob?: Date;
  weight?: number;
  color?: string;
  breed?: string;
  note?: string | null;
  isSterilized?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IPetRepository {
  findAll(filter: GetPetsFilter): Promise<PaginatedResult<PetEntity>>;
  findById(id: string): Promise<PetEntity | null>;
  create(data: CreatePetData): Promise<PetEntity>;
  update(data: UpdatePetData): Promise<PetEntity>;
  delete(id: string): Promise<void>;
}
