import { MicrochipStatus } from '@/enums/microchip';
import { Prisma } from '../../../../../generated/prisma/client';
import { MicrochipEntity } from '../../domain/microchip.entity';

export type MicrochipRaw = Prisma.MicrochipGetPayload<object>;

export class MicrochipPrismaMapper {
  static toDomain(raw: MicrochipRaw): MicrochipEntity {
    return MicrochipEntity.reconstitute(raw.id, {
      batchId: raw.batchId,
      microchipCode: raw.microchipCode,
      status: raw.status as MicrochipStatus,
      petId: raw.petId,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrismaCreate(microchip: MicrochipEntity) {
    return {
      id: microchip.id,
      batchId: microchip.batchId,
      microchipCode: microchip.microchipCode,
      status: microchip.status,
      petId: microchip.petId,
      isDeleted: microchip.isDeleted,
      createdAt: microchip.createdAt,
      updatedAt: microchip.updatedAt,
      deletedAt: microchip.deletedAt,
    };
  }

  static toPrismaUpdate(microchip: MicrochipEntity) {
    return {
      batchId: microchip.batchId,
      microchipCode: microchip.microchipCode,
      status: microchip.status,
      petId: microchip.petId,
      isDeleted: microchip.isDeleted,
      updatedAt: microchip.updatedAt,
      deletedAt: microchip.deletedAt,
    };
  }
}
