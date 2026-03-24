import { Injectable } from '@nestjs/common';
import { I_SpeciesRepository } from '../domain/i-species.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { SpeciesEntity } from '../domain/species.entity';
import { SpeciesMapper } from './species.mapper';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';
import { Params } from '@/shared/domain/query-params.type';

@Injectable()
export class SpeciesRepository implements I_SpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: Params): Promise<PaginatedResult<SpeciesEntity>> {
    const { page, limit, search } = filter;

    const where = {
      isDeleted: false,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { breed: { contains: search, mode: 'insensitive' as const } },
              { color: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.species.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.species.count({ where }),
    ]);

    return {
      data: rows.map(row => SpeciesMapper.toDomain(row)),
      total,
      page,
      limit,
    };
  }

  async findById(speciesId: string): Promise<SpeciesEntity | null> {
    const species = await this.prisma.species.findUnique({
      where: { id: speciesId, isDeleted: false },
    });
    return species ? SpeciesMapper.toDomain(species) : null;
  }
}
