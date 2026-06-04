import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { MicrochipBatchModel } from '../../application/model/microchip-batch.model';
import { MicrochipBatchQueryPort } from '../../application/ports/microchip-batch.query.port';
import { FindMicrochipBatchOptions, PaginatedResult } from '../../application/ports/microchip-batch.repository.port';
import { MicrochipBatchNotFoundError } from '../../domain/exceptions/microchip-batch.error';

type MicrochipBatchRaw = Prisma.MicrochipBatchGetPayload<object>;

@Injectable()
export class MicrochipBatchQueryPortImp implements MicrochipBatchQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MicrochipBatchModel> {
    const raw = await this.prisma.microchipBatch.findFirst({
      where: { id, isDeleted: false },
    });

    if (!raw) throw new MicrochipBatchNotFoundError(id);

    return this.toModel(raw);
  }

  async findMany(options: FindMicrochipBatchOptions): Promise<PaginatedResult<MicrochipBatchModel>> {
    const { page, limit, search } = options;
    const searchValue = search?.trim();

    const where: Prisma.MicrochipBatchWhereInput = {
      isDeleted: false,
      ...(searchValue && {
        OR: [
          { batchNo: { contains: searchValue, mode: 'insensitive' } },
          { vendorName: { contains: searchValue, mode: 'insensitive' } },
          { manufacturer: { contains: searchValue, mode: 'insensitive' } },
          { model: { contains: searchValue, mode: 'insensitive' } },
          { notes: { contains: searchValue, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.microchipBatch.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.microchipBatch.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: MicrochipBatchRaw): MicrochipBatchModel {
    return {
      id: raw.id,
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
    };
  }
}
