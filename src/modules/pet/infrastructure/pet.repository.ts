import { Injectable } from '@nestjs/common';
import { GetPetsFilter, IPetRepository, PaginatedResult } from '../domain/i-pet.entity';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { PetEntity } from '../domain/pet.entity';
import { PetMapper } from './pet.mapper';

@Injectable()
export class PetRepository implements IPetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PetEntity[]> {
    const raws = await this.prisma.pet.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return raws ? raws.map(raw => PetMapper.toDomain(raw)) : [];
  }

  async findAllWithFilters(filter: GetPetsFilter): Promise<PaginatedResult<PetEntity>> {
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
      this.prisma.pet.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pet.count({ where }),
    ]);

    return {
      data: rows.map(row => PetMapper.toDomain(row)),
      total,
      page,
      limit,
    };
  }
}
