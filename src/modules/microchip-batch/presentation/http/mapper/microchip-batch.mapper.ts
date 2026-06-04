import { MicrochipBatchModel } from '../../../application/model/microchip-batch.model';
import { MicrochipBatchResponseDTO } from '../dto/microchip-batch-response.dto';

export class MicrochipBatchHttpMapper {
  static toResponse(microchipBatch: MicrochipBatchModel): MicrochipBatchResponseDTO {
    return {
      id: microchipBatch.id,
      batchNo: microchipBatch.batchNo,
      vendorName: microchipBatch.vendorName,
      manufacturer: microchipBatch.manufacturer,
      model: microchipBatch.model,
      importDate: microchipBatch.importDate,
      totalQuantity: microchipBatch.totalQuantity,
      notes: microchipBatch.notes,
      isDeleted: microchipBatch.isDeleted,
      createdAt: microchipBatch.createdAt,
      updatedAt: microchipBatch.updatedAt,
      deletedAt: microchipBatch.deletedAt,
    };
  }

  static toResponseList(items: MicrochipBatchModel[]): MicrochipBatchResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
