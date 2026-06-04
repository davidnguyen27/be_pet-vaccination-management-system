import { MicrochipStatus } from '@/enums/microchip';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BatchIdNotFoundError } from '../../domain/exceptions/batch-id.error';
import { MicrochipCodeDuplicateError } from '../../domain/exceptions/microchip-code.error';
import { PetIdNotFoundError } from '../../domain/exceptions/pet-id.error';
import { MicrochipEntity } from '../../domain/microchip.entity';
import { MicrochipModel } from '../model/microchip.model';
import { MicrochipQueryPort } from '../ports/microchip.query.port';
import { MicrochipRepositoryPort } from '../ports/microchip.repository.port';

export interface CreateMicrochipCommand {
  batchId: string;
  microchipCode: string;
  status: MicrochipStatus;
  petId?: string | null;
}

@Injectable()
export class CreateMicrochipUseCase {
  constructor(
    private readonly microchipRepo: MicrochipRepositoryPort,
    private readonly microchipQuery: MicrochipQueryPort,
  ) {}

  async execute(command: CreateMicrochipCommand): Promise<MicrochipModel> {
    await this.ensureBatchExists(command.batchId);
    await this.ensurePetExists(command.petId);

    const existingMicrochip = await this.microchipRepo.findByMicrochipCode(command.microchipCode);
    if (existingMicrochip) throw new MicrochipCodeDuplicateError(command.microchipCode);

    const microchip = MicrochipEntity.create(randomUUID(), command);
    await this.microchipRepo.save(microchip);

    return this.microchipQuery.findById(microchip.id);
  }

  private async ensureBatchExists(batchId: string): Promise<void> {
    if (!(await this.microchipRepo.existsBatch(batchId))) {
      throw new BatchIdNotFoundError(batchId);
    }
  }

  private async ensurePetExists(petId?: string | null): Promise<void> {
    const normalizedId = petId?.trim();
    if (!normalizedId) return;

    if (!(await this.microchipRepo.existsPet(normalizedId))) {
      throw new PetIdNotFoundError(normalizedId);
    }
  }
}
