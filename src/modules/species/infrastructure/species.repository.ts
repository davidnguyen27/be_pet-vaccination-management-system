import { Injectable } from '@nestjs/common';
import { GetSpeciesFilter, I_SpeciesRepository } from '../domain/i-species.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { PaginatedResult } from '@/modules/user/domain/i-user.repository';
import { SpeciesEntity } from '../domain/species.entity';
import { SpeciesMapper } from './species.mapper';

@Injectable()
export class SpeciesRepository implements I_SpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: GetSpeciesFilter): Promise<PaginatedResult<SpeciesEntity>> {
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

  async findById(id: string): Promise<SpeciesEntity | null> {
    const species = await this.prisma.species.findUnique({
      where: { speciesId: id, isDeleted: false },
    });
    return species ? SpeciesMapper.toDomain(species) : null;
  }
}
