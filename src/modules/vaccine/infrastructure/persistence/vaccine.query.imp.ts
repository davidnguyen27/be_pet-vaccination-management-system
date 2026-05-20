import { Species } from '@/enums/species';
import { VaccineStatus } from '@/enums/vaccine';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { species_code } from '../../../../../generated/prisma/enums';
import { VaccineModel } from '../../application/model/vaccine.model';
import { VaccineQueryPort } from '../../application/ports/vaccine.query.port';
import { FindVaccineOptions, PaginatedResult } from '../../application/ports/vaccine.repository.port';
import { VaccineNotFoundError } from '../../domain/exceptions/vaccine.error';

type VaccineWithSpeciesRaw = Prisma.VaccineGetPayload<{
  include: {
    species: true;
  };
}>;

@Injectable()
export class VaccineQueryPortImp implements VaccineQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VaccineModel> {
    const raw = await this.prisma.vaccine.findFirst({
      where: {
        id,
        isDeleted: false,
        species: { isDeleted: false },
      },
      include: VaccineQueryPortImp.includeRelations(),
    });

    if (!raw) {
      throw new VaccineNotFoundError(id);
    }

    return this.toModel(raw);
  }

  async findMany(options: FindVaccineOptions): Promise<PaginatedResult<VaccineModel>> {
    const { page, limit, search, species } = options;
    const searchValue = search?.trim();

    const where: Prisma.VaccineWhereInput = {
      isDeleted: false,
      species: {
        isDeleted: false,
        ...(species ? { code: VaccineQueryPortImp.toSpeciesCode(species as Species) } : {}),
      },
      ...(searchValue && {
        OR: [
          { code: { contains: searchValue, mode: 'insensitive' } },
          { name: { contains: searchValue, mode: 'insensitive' } },
          { brand: { contains: searchValue, mode: 'insensitive' } },
          { description: { contains: searchValue, mode: 'insensitive' } },
          { species: { name: { contains: searchValue, mode: 'insensitive' } } },
          { species: { code: { equals: VaccineQueryPortImp.toSpeciesCode(searchValue as Species) } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vaccine.findMany({
        where,
        include: VaccineQueryPortImp.includeRelations(),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vaccine.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: VaccineWithSpeciesRaw): VaccineModel {
    return {
      id: raw.id,
      species: raw.species.name,
      code: raw.code,
      name: raw.name,
      brand: raw.brand,
      imgUrl: raw.imgUrl,
      description: raw.description,
      doseValue: raw.doseValue,
      doseUnit: raw.doseUnit,
      status: raw.status as VaccineStatus,
      defaultTotalDoses: raw.defaultTotalDoses,
      defaultNextDueDays: raw.defaultNextDueDays,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  private static includeRelations() {
    return {
      species: true,
    } satisfies Prisma.VaccineInclude;
  }

  private static toSpeciesCode(species: Species): species_code {
    return species as unknown as species_code;
  }
}
