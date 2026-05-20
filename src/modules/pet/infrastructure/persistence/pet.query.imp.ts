import { Species } from '@/enums/species';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { species_code } from '../../../../../generated/prisma/enums';
import { PetModel } from '../../application/model/pet.model';
import { PetQueryPort } from '../../application/ports/pet.query.port';
import { FindPetOptions, PaginatedResult } from '../../application/ports/pet.repository.port';
import { PetNotFoundError } from '../../domain/exceptions/pet.error';

type PetWithRelationsRaw = Prisma.PetGetPayload<{
  include: {
    owner: {
      include: {
        user: {
          include: {
            role: true;
          };
        };
      };
    };
    species: true;
  };
}>;

@Injectable()
export class PetQueryImp implements PetQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PetModel> {
    const raw = await this.prisma.pet.findFirst({
      where: {
        id,
        isDeleted: false,
        owner: { user: { isDeleted: false } },
        species: { isDeleted: false },
      },
      include: PetQueryImp.includeRelations(),
    });

    if (!raw) {
      throw new PetNotFoundError(id);
    }

    return this.toModel(raw);
  }

  async findMany(options: FindPetOptions): Promise<PaginatedResult<PetModel>> {
    const { page, limit, search, species } = options;
    const searchValue = search?.trim();

    const where: Prisma.PetWhereInput = {
      isDeleted: false,
      owner: { user: { isDeleted: false } },
      species: {
        isDeleted: false,
        ...(species ? { code: PetQueryImp.toSpeciesCode(species) } : {}),
      },
      ...(searchValue && {
        OR: [
          { name: { contains: searchValue, mode: 'insensitive' } },
          { breed: { contains: searchValue, mode: 'insensitive' } },
          { color: { contains: searchValue, mode: 'insensitive' } },
          { note: { contains: searchValue, mode: 'insensitive' } },
          { species: { name: { contains: searchValue, mode: 'insensitive' } } },
          { species: { code: { equals: PetQueryImp.toSpeciesCode(searchValue as Species) } } },
          { owner: { user: { email: { contains: searchValue, mode: 'insensitive' } } } },
          { owner: { user: { fullName: { contains: searchValue, mode: 'insensitive' } } } },
          { owner: { user: { phoneNumber: { contains: searchValue, mode: 'insensitive' } } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.pet.findMany({
        where,
        include: PetQueryImp.includeRelations(),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pet.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: PetWithRelationsRaw): PetModel {
    return {
      id: raw.id,
      owner: {
        id: raw.owner.id,
        user: {
          id: raw.owner.user.id,
          role: raw.owner.user.role.name,
          email: raw.owner.user.email,
          fullName: raw.owner.user.fullName ?? null,
          phoneNumber: raw.owner.user.phoneNumber ?? null,
          avatarUrl: raw.owner.user.avatarUrl ?? null,
          dob: raw.owner.user.dob ?? null,
        },
        address: raw.owner.address ?? null,
        locationLat: raw.owner.locationLat ?? null,
        locationLng: raw.owner.locationLng ?? null,
        totalPoints: raw.owner.totalPoints,
      },
      species: raw.species.name,
      name: raw.name,
      sex: raw.sex,
      dob: raw.dob,
      weight: raw.weight,
      color: raw.color,
      breed: raw.breed,
      note: raw.note,
      isSterilized: raw.isSterilized,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  private static includeRelations() {
    return {
      owner: {
        include: {
          user: {
            include: { role: true },
          },
        },
      },
      species: true,
    } satisfies Prisma.PetInclude;
  }

  private static toSpeciesCode(species: Species): species_code {
    return species as unknown as species_code;
  }
}
