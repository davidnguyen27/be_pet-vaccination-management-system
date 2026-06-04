import { Injectable } from '@nestjs/common';
import { BatchNoDuplicateError } from '../../domain/exceptions/batch-no.error';
import { MicrochipBatchModel } from '../model/microchip-batch.model';
import { MicrochipBatchQueryPort } from '../ports/microchip-batch.query.port';
import { MicrochipBatchRepositoryPort } from '../ports/microchip-batch.repository.port';

export interface UpdateMicrochipBatchCommand {
  id: string;
  batchNo?: string;
  vendorName?: string;
  manufacturer?: string;
  model?: string;
  importDate?: Date;
  totalQuantity?: number;
  notes?: string | null;
}

@Injectable()
export class UpdateMicrochipBatchUseCase {
  constructor(
    private readonly microchipBatchRepo: MicrochipBatchRepositoryPort,
    private readonly microchipBatchQuery: MicrochipBatchQueryPort,
  ) {}

  async execute(command: UpdateMicrochipBatchCommand): Promise<MicrochipBatchModel> {
    const microchipBatch = await this.microchipBatchRepo.findByIdOrThrow(command.id);

    if (command.batchNo !== undefined && command.batchNo.trim() !== microchipBatch.batchNo) {
      const existingBatch = await this.microchipBatchRepo.findByBatchNo(command.batchNo);
      if (existingBatch && existingBatch.id !== command.id) {
        throw new BatchNoDuplicateError(command.batchNo);
      }
    }

    microchipBatch.update({
      batchNo: command.batchNo,
      vendorName: command.vendorName,
      manufacturer: command.manufacturer,
      model: command.model,
      importDate: command.importDate,
      totalQuantity: command.totalQuantity,
      notes: command.notes,
    });

    await this.microchipBatchRepo.save(microchipBatch);

    return this.microchipBatchQuery.findById(microchipBatch.id);
  }
}
