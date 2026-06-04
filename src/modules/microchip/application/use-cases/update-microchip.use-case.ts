import { MicrochipStatus } from '@/enums/microchip';
import { Injectable } from '@nestjs/common';
import { BatchIdNotFoundError } from '../../domain/exceptions/batch-id.error';
import { MicrochipCodeDuplicateError } from '../../domain/exceptions/microchip-code.error';
import { PetIdNotFoundError } from '../../domain/exceptions/pet-id.error';
import { MicrochipModel } from '../model/microchip.model';
import { MicrochipQueryPort } from '../ports/microchip.query.port';
import { MicrochipRepositoryPort } from '../ports/microchip.repository.port';

export interface UpdateMicrochipCommand {
  id: string;
  batchId?: string;
  microchipCode?: string;
  status?: MicrochipStatus;
  petId?: string | null;
}

@Injectable()
export class UpdateMicrochipUseCase {
  constructor(
    private readonly microchipRepo: MicrochipRepositoryPort,
    private readonly microchipQuery: MicrochipQueryPort,
  ) {}

  async execute(command: UpdateMicrochipCommand): Promise<MicrochipModel> {
    const microchip = await this.microchipRepo.findByIdOrThrow(command.id);

    if (command.batchId !== undefined && command.batchId !== microchip.batchId) {
      await this.ensureBatchExists(command.batchId);
    }

    if (command.petId !== undefined && command.petId !== microchip.petId) {
      await this.ensurePetExists(command.petId);
    }

    if (command.microchipCode !== undefined && command.microchipCode.trim() !== microchip.microchipCode) {
      const existingMicrochip = await this.microchipRepo.findByMicrochipCode(command.microchipCode);
      if (existingMicrochip && existingMicrochip.id !== command.id) {
        throw new MicrochipCodeDuplicateError(command.microchipCode);
      }
    }

    microchip.update({
      batchId: command.batchId,
      microchipCode: command.microchipCode,
      status: command.status,
      petId: command.petId,
    });

    await this.microchipRepo.save(microchip);

    return this.microchipQuery.findById(microchip.id);
  }

  private async ensureBatchExists(batchId: string): Promise<void> {
    if (!(await this.microchipRepo.existsBatch(batchId))) {
      throw new BatchIdNotFoundError(batchId);
    }
  }

  private async ensurePetExists(petId: string | null): Promise<void> {
    const normalizedId = petId?.trim();
    if (!normalizedId) return;

    if (!(await this.microchipRepo.existsPet(normalizedId))) {
      throw new PetIdNotFoundError(normalizedId);
    }
  }
}
