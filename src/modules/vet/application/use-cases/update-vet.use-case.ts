import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_VET_REPOSITORY, type IVetRepository } from '../../domain/i-vet.repository';
import { VetDto } from '../dtos/vet-req.dto';
import { VetResponseDto } from '../dtos/vet-res.dto';
import { VetMapper } from '../../infrastructure/vet.mapper';

@Injectable()
export class UpdateVetUseCase {
  constructor(@Inject(I_VET_REPOSITORY) private readonly vetRepo: IVetRepository) {}

  async execute(userId: string, dto: VetDto): Promise<VetResponseDto> {
    const vet = await this.vetRepo.findByUserId(userId);
    if (!vet) throw new NotFoundException('Vet not found');

    const updated = await this.vetRepo.update({
      userId,
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.citizenId !== undefined && { citizenId: dto.citizenId }),
      ...(dto.employmentStatus !== undefined && { employmentStatus: dto.employmentStatus }),
      ...(dto.joinDate !== undefined && { joinDate: dto.joinDate }),
      ...(dto.endDate !== undefined && { endDate: dto.endDate }),
      ...(dto.licenseIssueBy !== undefined && { licenseIssueBy: dto.licenseIssueBy }),
      ...(dto.licenseNo !== undefined && { licenseNo: dto.licenseNo }),
      ...(dto.licenseValidFrom !== undefined && { licenseValidFrom: dto.licenseValidFrom }),
      ...(dto.licenseValidTo !== undefined && { licenseValidTo: dto.licenseValidTo }),
    });

    return VetMapper.toResponse(updated);
  }
}
