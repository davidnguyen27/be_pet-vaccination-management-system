import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_OWNER_REPOSITORY, IOwnerRepository } from '../../domain/i-owner.repository';
import { OwnerDto } from '../dtos/owner-req.dto';
import { OwnerResponseDto } from '../dtos/owner-res.dto';
import { OwnerMapper } from '../../infrastructure/owner.mapper';

@Injectable()
export class UpdateOwnerUseCase {
  constructor(@Inject(I_OWNER_REPOSITORY) private readonly ownerRepo: IOwnerRepository) {}

  async execute(userId: string, dto: OwnerDto): Promise<OwnerResponseDto> {
    const existing = await this.ownerRepo.findByUserId(userId);
    if (!existing) {
      throw new NotFoundException('Owner not found');
    }

    const updated = await this.ownerRepo.update({
      userId,
      address: dto.address,
      locationLat: dto.locationLat,
      locationLng: dto.locationLng,
    });

    return OwnerMapper.toResponse(updated);
  }
}
