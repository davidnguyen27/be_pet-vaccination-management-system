import { Injectable } from '@nestjs/common';
import { MicrochipBatchRepositoryPort } from '../ports/microchip-batch.repository.port';

@Injectable()
export class DeleteMicrochipBatchUseCase {
  constructor(private readonly microchipBatchRepo: MicrochipBatchRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const microchipBatch = await this.microchipBatchRepo.findByIdOrThrow(id);
    microchipBatch.softDelete();
    await this.microchipBatchRepo.save(microchipBatch);
  }
}
