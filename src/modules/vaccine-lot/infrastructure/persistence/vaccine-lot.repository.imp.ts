import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  FindVaccineLotOptions,
  PaginatedResult,
  VaccineLotRepositoryPort,
} from '../../application/ports/vaccine-lot.repository.port';
import { VaccineLotNotFoundError } from '../../domain/exceptions/vaccine-lot.error';
import { VaccineLotEntity } from '../../domain/vaccine-lot.entity';
import { VaccineLotPrismaMapper } from './vaccine-lot.mapper';

@Injectable()
export class VaccineLotRepository implements VaccineLotRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VaccineLotEntity | null> {
    const raw = await this.prisma.vaccineLot.findFirst({
      where: { id, isDeleted: false },
    });

    return raw ? VaccineLotPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<VaccineLotEntity> {
    const vaccineLot = await this.findById(id);
    if (!vaccineLot) throw new VaccineLotNotFoundError(id);
    return vaccineLot;
  }

  async findByLotNo(lotNo: string): Promise<VaccineLotEntity | null> {
    const normalizedLotNo = lotNo.trim().toUpperCase();
    if (!normalizedLotNo) return null;

    const raw = await this.prisma.vaccineLot.findFirst({
      where: {
        lotNo: { equals: normalizedLotNo, mode: 'insensitive' },
        isDeleted: false,
      },
    });

    return raw ? VaccineLotPrismaMapper.toDomain(raw) : null;
  }

  async findMany(options: FindVaccineLotOptions): Promise<PaginatedResult<VaccineLotEntity>> {
    const { page, limit, search, vaccineId, status } = options;
    const searchValue = search?.trim();
    const vaccineIdValue = vaccineId?.trim();

    const where: Prisma.VaccineLotWhereInput = {
      isDeleted: false,
      ...(vaccineIdValue && { vaccineId: vaccineIdValue }),
      ...(status && { status }),
      ...(searchValue && {
        OR: [
          { lotNo: { contains: searchValue, mode: 'insensitive' } },
          { vaccine: { code: { contains: searchValue, mode: 'insensitive' } } },
          { vaccine: { name: { contains: searchValue, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vaccineLot.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vaccineLot.count({ where }),
    ]);

    return {
      items: raws.map(raw => VaccineLotPrismaMapper.toDomain(raw)),
      totalItems,
    };
  }

  async save(vaccineLot: VaccineLotEntity): Promise<void> {
    await this.prisma.vaccineLot.upsert({
      where: { id: vaccineLot.id },
      create: VaccineLotPrismaMapper.toPrismaCreate(vaccineLot),
      update: VaccineLotPrismaMapper.toPrismaUpdate(vaccineLot),
    });
  }
}
