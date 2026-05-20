import { VaccineLotStatus, VaccineStatus } from '@/enums/vaccine';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { VaccineLotModel } from '../../application/model/vaccine-lot.model';
import { VaccineLotQueryPort } from '../../application/ports/vaccine-lot.query.port';
import { FindVaccineLotOptions, PaginatedResult } from '../../application/ports/vaccine-lot.repository.port';
import { VaccineLotNotFoundError } from '../../domain/exceptions/vaccine-lot.error';

type VaccineLotWithVaccineRaw = Prisma.VaccineLotGetPayload<{
  include: {
    vaccine: {
      select: {
        id: true;
        species: {
          select: {
            name: true;
          };
        };
        code: true;
        name: true;
        brand: true;
        imgUrl: true;
        description: true;
        doseValue: true;
        doseUnit: true;
        status: true;
        defaultTotalDoses: true;
        defaultNextDueDays: true;
      };
    };
  };
}>;

@Injectable()
export class VaccineLotQueryPortImp implements VaccineLotQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VaccineLotModel> {
    const raw = await this.prisma.vaccineLot.findFirst({
      where: {
        id,
        isDeleted: false,
        vaccine: { isDeleted: false },
      },
      include: VaccineLotQueryPortImp.includeRelations(),
    });

    if (!raw) throw new VaccineLotNotFoundError(id);

    return this.toModel(raw);
  }

  async findMany(options: FindVaccineLotOptions): Promise<PaginatedResult<VaccineLotModel>> {
    const { page, limit, search, vaccineId, status } = options;
    const searchValue = search?.trim();
    const vaccineIdValue = vaccineId?.trim();

    const where: Prisma.VaccineLotWhereInput = {
      isDeleted: false,
      vaccine: {
        isDeleted: false,
        ...(vaccineIdValue && { id: vaccineIdValue }),
      },
      ...(status && { status }),
      ...(searchValue && {
        OR: [
          { lotNo: { contains: searchValue, mode: 'insensitive' } },
          { vaccine: { code: { contains: searchValue, mode: 'insensitive' } } },
          { vaccine: { name: { contains: searchValue, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vaccineLot.findMany({
        where,
        include: VaccineLotQueryPortImp.includeRelations(),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vaccineLot.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: VaccineLotWithVaccineRaw): VaccineLotModel {
    return {
      id: raw.id,
      vaccine: {
        id: raw.vaccine.id,
        species: raw.vaccine.species.name,
        code: raw.vaccine.code,
        name: raw.vaccine.name,
        brand: raw.vaccine.brand,
        imgUrl: raw.vaccine.imgUrl,
        description: raw.vaccine.description,
        doseValue: raw.vaccine.doseValue,
        doseUnit: raw.vaccine.doseUnit,
        status: raw.vaccine.status as VaccineStatus,
        defaultTotalDoses: raw.vaccine.defaultTotalDoses,
        defaultNextDueDays: raw.vaccine.defaultNextDueDays,
      },
      lotNo: raw.lotNo,
      mfgDate: raw.mfgDate,
      expDate: raw.expDate,
      initialQuantity: raw.initialQuantity,
      quantityOnHand: raw.quantityOnHand,
      storageTempMin: raw.storageTempMin,
      storageTempMax: raw.storageTempMax,
      status: raw.status as VaccineLotStatus,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  private static includeRelations() {
    return {
      vaccine: {
        select: {
          id: true,
          species: {
            select: {
              name: true,
            },
          },
          code: true,
          name: true,
          brand: true,
          imgUrl: true,
          description: true,
          doseValue: true,
          doseUnit: true,
          status: true,
          defaultTotalDoses: true,
          defaultNextDueDays: true,
        },
      },
    } satisfies Prisma.VaccineLotInclude;
  }
}
