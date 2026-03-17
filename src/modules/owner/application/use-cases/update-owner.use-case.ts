import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_OWNER_REPOSITORY, IOwnerRepository } from '../../domain/i-owner.repository';
import { OwnerDto } from '../dtos/owner-req.dto';
import { OwnerResponseDto } from '../dtos/owner-res.dto';
import { OwnerMapper } from '../../infrastructure/owner.mapper';

@Injectable()
export class UpdateOwnerUseCase {
  constructor(@Inject(I_OWNER_REPOSITORY) private readonly ownerRepo: IOwnerRepository) {}

  async execute(ownerId: string, dto: OwnerDto): Promise<OwnerResponseDto> {
    const existing = await this.ownerRepo.findById(ownerId);
    if (!existing) {
      throw new NotFoundException('Owner not found');
    }

    const updated = await this.ownerRepo.update({
      id: ownerId,
      address: dto.address,
      locationLat: dto.locationLat,
      locationLng: dto.locationLng,
    });

    return OwnerMapper.toResponse(updated);
  }
}
