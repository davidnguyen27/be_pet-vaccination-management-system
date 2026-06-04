import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BatchNoDuplicateError } from '../../domain/exceptions/batch-no.error';
import { MicrochipBatchEntity } from '../../domain/microchip-batch.entity';
import { MicrochipBatchModel } from '../model/microchip-batch.model';
import { MicrochipBatchQueryPort } from '../ports/microchip-batch.query.port';
import { MicrochipBatchRepositoryPort } from '../ports/microchip-batch.repository.port';

export interface CreateMicrochipBatchCommand {
  batchNo: string;
  vendorName: string;
  manufacturer: string;
  model: string;
  importDate: Date;
  totalQuantity: number;
  notes?: string | null;
}

@Injectable()
export class CreateMicrochipBatchUseCase {
  constructor(
    private readonly microchipBatchRepo: MicrochipBatchRepositoryPort,
    private readonly microchipBatchQuery: MicrochipBatchQueryPort,
  ) {}

  async execute(command: CreateMicrochipBatchCommand): Promise<MicrochipBatchModel> {
    const existingBatch = await this.microchipBatchRepo.findByBatchNo(command.batchNo);
    if (existingBatch) throw new BatchNoDuplicateError(command.batchNo);

    const microchipBatch = MicrochipBatchEntity.create(randomUUID(), command);
    await this.microchipBatchRepo.save(microchipBatch);

    return this.microchipBatchQuery.findById(microchipBatch.id);
  }
}
