import { MicrochipStatus } from '@/enums/microchip';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { MicrochipModel } from '../../application/model/microchip.model';
import { MicrochipQueryPort } from '../../application/ports/microchip.query.port';
import { FindMicrochipOptions, PaginatedResult } from '../../application/ports/microchip.repository.port';
import { MicrochipNotFoundError } from '../../domain/exceptions/microchip.error';

type MicrochipWithRelationsRaw = Prisma.MicrochipGetPayload<{
  include: {
    microchipBatch: {
      select: {
        id: true;
        batchNo: true;
        vendorName: true;
        manufacturer: true;
        model: true;
        importDate: true;
        totalQuantity: true;
        notes: true;
        isDeleted: true;
      };
    };
    pet: {
      select: {
        id: true;
        species: {
          select: {
            name: true;
          };
        };
        name: true;
        sex: true;
        dob: true;
        weight: true;
        color: true;
        breed: true;
        note: true;
        isSterilized: true;
      };
    };
  };
}>;

@Injectable()
export class MicrochipQueryPortImp implements MicrochipQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MicrochipModel> {
    const raw = await this.prisma.microchip.findFirst({
      where: {
        id,
        isDeleted: false,
        microchipBatch: { isDeleted: false },
        OR: [{ petId: null }, { pet: { is: { isDeleted: false, species: { isDeleted: false } } } }],
      },
      include: MicrochipQueryPortImp.includeRelations(),
    });

    if (!raw) throw new MicrochipNotFoundError(id);

    return this.toModel(raw);
  }

  async findMany(options: FindMicrochipOptions): Promise<PaginatedResult<MicrochipModel>> {
    const { page, limit, search, batchId, petId, status } = options;
    const searchValue = search?.trim();
    const batchIdValue = batchId?.trim();
    const petIdValue = petId?.trim();

    const where: Prisma.MicrochipWhereInput = {
      isDeleted: false,
      microchipBatch: {
        isDeleted: false,
        ...(batchIdValue && { id: batchIdValue }),
      },
      OR: [{ petId: null }, { pet: { is: { isDeleted: false, species: { isDeleted: false } } } }],
      ...(petIdValue && { petId: petIdValue }),
      ...(status && { status }),
      ...(searchValue && {
        AND: [
          {
            OR: [
              { microchipCode: { contains: searchValue, mode: 'insensitive' } },
              { microchipBatch: { batchNo: { contains: searchValue, mode: 'insensitive' } } },
              { microchipBatch: { vendorName: { contains: searchValue, mode: 'insensitive' } } },
              { microchipBatch: { manufacturer: { contains: searchValue, mode: 'insensitive' } } },
              { pet: { is: { name: { contains: searchValue, mode: 'insensitive' } } } },
              { pet: { is: { breed: { contains: searchValue, mode: 'insensitive' } } } },
            ],
          },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.microchip.findMany({
        where,
        include: MicrochipQueryPortImp.includeRelations(),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.microchip.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: MicrochipWithRelationsRaw): MicrochipModel {
    return {
      id: raw.id,
      batch: {
        id: raw.microchipBatch.id,
        batchNo: raw.microchipBatch.batchNo,
        vendorName: raw.microchipBatch.vendorName,
        manufacturer: raw.microchipBatch.manufacturer,
        model: raw.microchipBatch.model,
        importDate: raw.microchipBatch.importDate,
        totalQuantity: raw.microchipBatch.totalQuantity,
        notes: raw.microchipBatch.notes,
        isDeleted: raw.microchipBatch.isDeleted,
      },
      microchipCode: raw.microchipCode,
      status: raw.status as MicrochipStatus,
      pet: raw.pet
        ? {
            id: raw.pet.id,
            species: raw.pet.species.name,
            name: raw.pet.name,
            sex: raw.pet.sex,
            dob: raw.pet.dob,
            weight: raw.pet.weight,
            color: raw.pet.color,
            breed: raw.pet.breed,
            note: raw.pet.note,
            isSterilized: raw.pet.isSterilized,
          }
        : null,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  private static includeRelations() {
    return {
      microchipBatch: {
        select: {
          id: true,
          batchNo: true,
          vendorName: true,
          manufacturer: true,
          model: true,
          importDate: true,
          totalQuantity: true,
          notes: true,
          isDeleted: true,
        },
      },
      pet: {
        select: {
          id: true,
          species: {
            select: {
              name: true,
            },
          },
          name: true,
          sex: true,
          dob: true,
          weight: true,
          color: true,
          breed: true,
          note: true,
          isSterilized: true,
        },
      },
    } satisfies Prisma.MicrochipInclude;
  }
}
