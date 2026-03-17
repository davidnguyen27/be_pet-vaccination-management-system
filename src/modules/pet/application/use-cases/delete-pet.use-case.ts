import { Inject, Injectable } from '@nestjs/common';
import { I_PET_REPOSITORY, IPetRepository } from '../../domain/i-pet.entity';

@Injectable()
export class DeletePetUseCase {
  constructor(@Inject(I_PET_REPOSITORY) private readonly petRepo: IPetRepository) {}

  async execute(id: string): Promise<void> {
    await this.petRepo.delete(id);
  }
}
