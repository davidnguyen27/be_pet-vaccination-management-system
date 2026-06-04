import { Prisma } from '../../../../../generated/prisma/client';
import { MicrochipBatchEntity } from '../../domain/microchip-batch.entity';

export type MicrochipBatchRaw = Prisma.MicrochipBatchGetPayload<object>;

export class MicrochipBatchPrismaMapper {
  static toDomain(raw: MicrochipBatchRaw): MicrochipBatchEntity {
    return MicrochipBatchEntity.reconstitute(raw.id, {
      batchNo: raw.batchNo,
      vendorName: raw.vendorName,
      manufacturer: raw.manufacturer,
      model: raw.model,
      importDate: raw.importDate,
      totalQuantity: raw.totalQuantity,
      notes: raw.notes,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrismaCreate(microchipBatch: MicrochipBatchEntity) {
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

  static toPrismaUpdate(microchipBatch: MicrochipBatchEntity) {
    return {
      batchNo: microchipBatch.batchNo,
      vendorName: microchipBatch.vendorName,
      manufacturer: microchipBatch.manufacturer,
      model: microchipBatch.model,
      importDate: microchipBatch.importDate,
      totalQuantity: microchipBatch.totalQuantity,
      notes: microchipBatch.notes,
      isDeleted: microchipBatch.isDeleted,
      updatedAt: microchipBatch.updatedAt,
      deletedAt: microchipBatch.deletedAt,
    };
  }
}
