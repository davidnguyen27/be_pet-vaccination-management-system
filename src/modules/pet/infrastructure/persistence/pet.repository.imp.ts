import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { PetRepositoryPort } from '../../application/ports/pet.repository.port';
import { PetNotFoundError } from '../../domain/exceptions/pet.error';
import { PetEntity } from '../../domain/pet.entity';
import { PetPrismaMapper } from './pet.mapper';

@Injectable()
export class PetRepositoryImp implements PetRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PetEntity | null> {
    const raw = await this.prisma.pet.findFirst({
      where: { id, isDeleted: false },
      include: {
        owner: true,
        species: true,
      },
    });

    return raw ? PetPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<PetEntity> {
    const pet = await this.findById(id);
    if (!pet) throw new PetNotFoundError(id);
    return pet;
  }

  async save(pet: PetEntity): Promise<void> {
    await this.prisma.pet.upsert({
      where: { id: pet.id },
      create: PetPrismaMapper.toPrismaCreate(pet),
      update: PetPrismaMapper.toPrismaUpdate(pet),
    });
  }
}
