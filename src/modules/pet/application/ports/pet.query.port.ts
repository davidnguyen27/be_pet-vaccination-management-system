import { PetModel } from '../model/pet.model';
import { FindPetOptions, PaginatedResult } from './pet.repository.port';

export abstract class PetQueryPort {
  abstract findById(id: string): Promise<PetModel>;
  abstract findMany(options: FindPetOptions): Promise<PaginatedResult<PetModel>>;
}
