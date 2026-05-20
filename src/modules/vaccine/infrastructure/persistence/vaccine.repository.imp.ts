import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  FindVaccineOptions,
  PaginatedResult,
  VaccineRepositoryPort,
} from '../../application/ports/vaccine.repository.port';
import { VaccineNotFoundError } from '../../domain/exceptions/vaccine.error';
import { VaccineEntity } from '../../domain/vaccine.entity';
import { VaccinePrismaMapper } from './vaccine.mapper';

@Injectable()
export class VaccineRepository implements VaccineRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private readonly vaccineInclude = {
    species: { select: { name: true } },
  } satisfies Prisma.VaccineInclude;

  async findById(id: string): Promise<VaccineEntity | null> {
    const raw = await this.prisma.vaccine.findFirst({
      where: { id, isDeleted: false },
      include: this.vaccineInclude,
    });

    return raw ? VaccinePrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<VaccineEntity> {
    const vaccine = await this.findById(id);
    if (!vaccine) throw new VaccineNotFoundError(id);
    return vaccine;
  }

  async findByCode(code: string): Promise<VaccineEntity | null> {
    const normalizedCode = code.trim();
    if (!normalizedCode) return null;

    const raw = await this.prisma.vaccine.findFirst({
      where: { code: { equals: normalizedCode, mode: 'insensitive' }, isDeleted: false },
      include: this.vaccineInclude,
    });

    return raw ? VaccinePrismaMapper.toDomain(raw) : null;
  }

  async findMany(options: FindVaccineOptions): Promise<PaginatedResult<VaccineEntity>> {
    const { search, page, limit, species } = options;
    const searchValue = search?.trim();
    const speciesValue = species?.trim();

    const where: Prisma.VaccineWhereInput = {
      isDeleted: false,
      ...(speciesValue && { species: { name: { equals: speciesValue, mode: 'insensitive' } } }),
      ...(searchValue && {
        OR: [
          { code: { contains: searchValue, mode: 'insensitive' } },
          { name: { contains: searchValue, mode: 'insensitive' } },
          { brand: { contains: searchValue, mode: 'insensitive' } },
          { description: { contains: searchValue, mode: 'insensitive' } },
          { species: { name: { contains: searchValue, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vaccine.findMany({
        where,
        include: this.vaccineInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vaccine.count({ where }),
    ]);

    return {
      items: raws.map(raw => VaccinePrismaMapper.toDomain(raw)),
      totalItems,
    };
  }

  async save(vaccine: VaccineEntity): Promise<void> {
    await this.prisma.vaccine.upsert({
      where: { id: vaccine.id },
      create: VaccinePrismaMapper.toPrismaCreate(vaccine),
      update: VaccinePrismaMapper.toPrismaUpdate(vaccine),
    });
  }
}
