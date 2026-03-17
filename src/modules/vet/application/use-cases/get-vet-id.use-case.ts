import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_VET_REPOSITORY, IVetRepository } from '../../domain/i-vet.repository';
import { VetResponseDto } from '../dtos/vet-res.dto';
import { VetMapper } from '../../infrastructure/vet.mapper';

@Injectable()
export class GetVetIdUseCase {
  constructor(@Inject(I_VET_REPOSITORY) private readonly vetRepo: IVetRepository) {}

  async execute(id: string): Promise<VetResponseDto> {
    const vet = await this.vetRepo.findById(id);
    if (!vet) throw new NotFoundException('Vet not found');
    return VetMapper.toResponse(vet);
  }
}
