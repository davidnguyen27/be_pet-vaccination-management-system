import { Injectable } from '@nestjs/common';
import { OwnerRepositoryPort } from '../ports/owner.repository.port';
import { OwnerEntity } from '../../domain/owner.entity';

interface UpdateOwnerCommand {
  id: string;
  address?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
}

@Injectable()
export class UpdateOwnerUseCase {
  constructor(private readonly ownerRepo: OwnerRepositoryPort) {}

  async execute(command: UpdateOwnerCommand): Promise<OwnerEntity> {
    const owner = await this.ownerRepo.findByUserIdOrThrow(command.id);
    owner.updateProfile({
      address: command.address,
      locationLat: command.locationLat,
      locationLng: command.locationLng,
    });

    await this.ownerRepo.save(owner);

    return owner;
  }
}
