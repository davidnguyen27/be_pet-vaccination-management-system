import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  FindMicrochipBatchOptions,
  MicrochipBatchRepositoryPort,
  PaginatedResult,
} from '../../application/ports/microchip-batch.repository.port';
import { MicrochipBatchNotFoundError } from '../../domain/exceptions/microchip-batch.error';
import { MicrochipBatchEntity } from '../../domain/microchip-batch.entity';
import { MicrochipBatchPrismaMapper } from './microchip-batch.mapper';

@Injectable()
export class MicrochipBatchRepository implements MicrochipBatchRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MicrochipBatchEntity | null> {
    const raw = await this.prisma.microchipBatch.findFirst({
      where: { id, isDeleted: false },
    });

    return raw ? MicrochipBatchPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<MicrochipBatchEntity> {
    const microchipBatch = await this.findById(id);
    if (!microchipBatch) throw new MicrochipBatchNotFoundError(id);
    return microchipBatch;
  }

  async findByBatchNo(batchNo: string): Promise<MicrochipBatchEntity | null> {
    const normalizedBatchNo = batchNo.trim();
    if (!normalizedBatchNo) return null;

    const raw = await this.prisma.microchipBatch.findFirst({
      where: {
        batchNo: { equals: normalizedBatchNo, mode: 'insensitive' },
      },
    });

    return raw ? MicrochipBatchPrismaMapper.toDomain(raw) : null;
  }

  async findMany(options: FindMicrochipBatchOptions): Promise<PaginatedResult<MicrochipBatchEntity>> {
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
      items: raws.map(raw => MicrochipBatchPrismaMapper.toDomain(raw)),
      totalItems,
    };
  }

  async save(microchipBatch: MicrochipBatchEntity): Promise<void> {
    await this.prisma.microchipBatch.upsert({
      where: { id: microchipBatch.id },
      create: MicrochipBatchPrismaMapper.toPrismaCreate(microchipBatch),
      update: MicrochipBatchPrismaMapper.toPrismaUpdate(microchipBatch),
    });
  }
}
