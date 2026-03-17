import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_VET_REPOSITORY, type IVetRepository } from '../../domain/i-vet.repository';
import { VetDto } from '../dtos/vet-req.dto';
import { VetResponseDto } from '../dtos/vet-res.dto';
import { VetMapper } from '../../infrastructure/vet.mapper';

@Injectable()
export class UpdateVetUseCase {
  constructor(@Inject(I_VET_REPOSITORY) private readonly vetRepo: IVetRepository) {}

  async execute(id: string, dto: VetDto): Promise<VetResponseDto> {
    const vet = await this.vetRepo.findById(id);
    if (!vet) throw new NotFoundException('Vet not found');

    const updated = await this.vetRepo.update({
      id,
      bio: dto.bio,
      address: dto.address,
      citizenId: dto.citizenId,
      employmentStatus: dto.employmentStatus,
      joinDate: dto.joinDate,
      endDate: dto.endDate,
      licenseIssueBy: dto.licenseIssueBy,
      licenseNo: dto.licenseNo,
      licenseValidFrom: dto.licenseValidFrom,
      licenseValidTo: dto.licenseValidTo,
    });

    return VetMapper.toResponse(updated);
  }
}
