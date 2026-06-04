import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  FindMicrochipOptions,
  MicrochipRepositoryPort,
  PaginatedResult,
} from '../../application/ports/microchip.repository.port';
import { MicrochipNotFoundError } from '../../domain/exceptions/microchip.error';
import { MicrochipEntity } from '../../domain/microchip.entity';
import { MicrochipPrismaMapper } from './microchip.mapper';

@Injectable()
export class MicrochipRepository implements MicrochipRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MicrochipEntity | null> {
    const raw = await this.prisma.microchip.findFirst({
      where: { id, isDeleted: false },
    });

    return raw ? MicrochipPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<MicrochipEntity> {
    const microchip = await this.findById(id);
    if (!microchip) throw new MicrochipNotFoundError(id);
    return microchip;
  }

  async findByMicrochipCode(microchipCode: string): Promise<MicrochipEntity | null> {
    const normalizedCode = microchipCode.trim();
    if (!normalizedCode) return null;

    const raw = await this.prisma.microchip.findFirst({
      where: {
        microchipCode: { equals: normalizedCode, mode: 'insensitive' },
      },
    });

    return raw ? MicrochipPrismaMapper.toDomain(raw) : null;
  }

  async findMany(options: FindMicrochipOptions): Promise<PaginatedResult<MicrochipEntity>> {
    const { page, limit, search, batchId, petId, status } = options;
    const searchValue = search?.trim();
    const batchIdValue = batchId?.trim();
    const petIdValue = petId?.trim();

    const where: Prisma.MicrochipWhereInput = {
      isDeleted: false,
      ...(batchIdValue && { batchId: batchIdValue }),
      ...(petIdValue && { petId: petIdValue }),
      ...(status && { status }),
      ...(searchValue && {
        OR: [
          { microchipCode: { contains: searchValue, mode: 'insensitive' } },
          { microchipBatch: { batchNo: { contains: searchValue, mode: 'insensitive' } } },
          { microchipBatch: { vendorName: { contains: searchValue, mode: 'insensitive' } } },
          { microchipBatch: { manufacturer: { contains: searchValue, mode: 'insensitive' } } },
          { pet: { is: { name: { contains: searchValue, mode: 'insensitive' } } } },
          { pet: { is: { breed: { contains: searchValue, mode: 'insensitive' } } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.microchip.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.microchip.count({ where }),
    ]);

    return {
      items: raws.map(raw => MicrochipPrismaMapper.toDomain(raw)),
      totalItems,
    };
  }

  async existsBatch(batchId: string): Promise<boolean> {
    const normalizedId = batchId.trim();
    if (!normalizedId) return false;

    const count = await this.prisma.microchipBatch.count({
      where: { id: normalizedId, isDeleted: false },
    });

    return count > 0;
  }

  async existsPet(petId: string): Promise<boolean> {
    const normalizedId = petId.trim();
    if (!normalizedId) return false;

    const count = await this.prisma.pet.count({
      where: {
        id: normalizedId,
        isDeleted: false,
        species: { isDeleted: false },
      },
    });

    return count > 0;
  }

  async save(microchip: MicrochipEntity): Promise<void> {
    await this.prisma.microchip.upsert({
      where: { id: microchip.id },
      create: MicrochipPrismaMapper.toPrismaCreate(microchip),
      update: MicrochipPrismaMapper.toPrismaUpdate(microchip),
    });
  }
}
