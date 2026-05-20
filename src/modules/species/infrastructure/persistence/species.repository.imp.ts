import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { species_code } from '../../../../../generated/prisma/enums';
import {
  FindSpeciesOptions,
  PaginatedResult,
  SpeciesRepositoryPort,
} from '../../application/ports/species.repository.port';
import { SpeciesNotFoundError } from '../../domain/exceptions/species.error';
import { SpeciesEntity } from '../../domain/species.entity';
import { SpeciesPrismaMapper } from './species.mapper';

@Injectable()
export class SpeciesRepository implements SpeciesRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SpeciesEntity | null> {
    const raw = await this.prisma.species.findUnique({
      where: { id },
    });

    return raw ? SpeciesPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<SpeciesEntity> {
    const species = await this.findById(id);
    if (!species) throw new SpeciesNotFoundError(id);
    return species;
  }

  async findMany(options: FindSpeciesOptions): Promise<PaginatedResult<SpeciesEntity>> {
    const { page, limit, search } = options;
    const normalizedSearch = search?.trim();
    const normalizedCode = normalizedSearch?.toUpperCase();

    const where: Prisma.SpeciesWhereInput = {
      isDeleted: false,
      ...(normalizedSearch && {
        OR: [
          { name: { contains: normalizedSearch, mode: 'insensitive' } },
          ...(normalizedCode && Object.values(species_code).includes(normalizedCode as species_code)
            ? [{ code: normalizedCode as species_code }]
            : []),
        ],
      }),
    };

    const [raws, total] = await this.prisma.$transaction([
      this.prisma.species.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.species.count({ where }),
    ]);

    return {
      items: raws.map(raw => SpeciesPrismaMapper.toDomain(raw)),
      total,
    };
  }

  async existsByCode(code: string, excludeId?: string): Promise<boolean> {
    const normalizedCode = code.trim().toUpperCase();

    if (!Object.values(species_code).includes(normalizedCode as species_code)) {
      return false;
    }

    const count = await this.prisma.species.count({
      where: {
        isDeleted: false,
        code: normalizedCode as species_code,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });

    return count > 0;
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const normalizedName = name.trim();
    const count = await this.prisma.species.count({
      where: {
        isDeleted: false,
        name: { equals: normalizedName, mode: 'insensitive' },
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });

    return count > 0;
  }

  async save(species: SpeciesEntity): Promise<void> {
    await this.prisma.species.upsert({
      where: { id: species.id },
      create: SpeciesPrismaMapper.toPrismaCreate(species) as Prisma.SpeciesCreateInput,
      update: SpeciesPrismaMapper.toPrismaUpdate(species) as Prisma.SpeciesUpdateInput,
    });
  }
}
