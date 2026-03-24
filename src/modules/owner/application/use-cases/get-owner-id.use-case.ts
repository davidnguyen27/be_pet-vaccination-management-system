import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_OWNER_REPOSITORY, IOwnerRepository } from '../../domain/i-owner.repository';
import { OwnerResponseDto } from '../dtos/owner-res.dto';
import { OwnerMapper } from '../../infrastructure/owner.mapper';

@Injectable()
export class GetOwnerByIdUseCase {
  constructor(@Inject(I_OWNER_REPOSITORY) private readonly ownerRepo: IOwnerRepository) {}

  async execute(userId: string): Promise<OwnerResponseDto> {
    const owner = await this.ownerRepo.findByUserId(userId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    return OwnerMapper.toResponse(owner);
  }
}
