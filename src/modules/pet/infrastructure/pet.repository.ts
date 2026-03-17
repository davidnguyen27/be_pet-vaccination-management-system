import { Injectable } from '@nestjs/common';
import { CreatePetData, GetPetsFilter, IPetRepository, PaginatedResult, UpdatePetData } from '../domain/i-pet.entity';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { PetEntity } from '../domain/pet.entity';
import { PetMapper } from './pet.mapper';

@Injectable()
export class PetRepository implements IPetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: GetPetsFilter): Promise<PaginatedResult<PetEntity>> {
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
        include: {
          owner: {
            include: {
              user: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
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

  async findById(petId: string): Promise<PetEntity | null> {
    const pet = await this.prisma.pet.findUnique({
      where: { petId, isDeleted: false },
      include: {
        owner: {
          include: {
            user: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
    return pet ? PetMapper.toDomain(pet) : null;
  }

  async create(data: CreatePetData): Promise<PetEntity> {
    const created = await this.prisma.pet.create({
      data: {
        ownerId: data.ownerId,
        speciesId: data.speciesId,
        name: data.name,
        sex: data.sex,
        dob: data.dob,
        weight: data.weight,
        color: data.color,
        breed: data.breed,
        note: data.note,
        isSterilized: data.isSterilized,
      },
      include: {
        owner: {
          include: {
            user: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    return PetMapper.toDomain(created);
  }

  async update(data: UpdatePetData): Promise<PetEntity> {
    const updated = await this.prisma.pet.update({
      where: { petId: data.id },
      data: {
        ...(data.ownerId !== undefined && { ownerId: data.ownerId }),
        ...(data.speciesId !== undefined && { speciesId: data.speciesId }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.sex !== undefined && { sex: data.sex }),
        ...(data.dob !== undefined && { dob: data.dob }),
        ...(data.weight !== undefined && { weight: data.weight }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.breed !== undefined && { breed: data.breed }),
        ...(data.note !== undefined && { note: data.note }),
        ...(data.isSterilized !== undefined && { isSterilized: data.isSterilized }),
      },
      include: {
        owner: {
          include: {
            user: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    return PetMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pet.update({
      where: { petId: id },
      data: { isDeleted: true },
    });
  }
}
