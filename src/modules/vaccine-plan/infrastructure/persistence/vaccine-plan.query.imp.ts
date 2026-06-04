import { VaccinePlanStatus, VaccineStatus } from '@/enums/vaccine';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { VaccinePlanModel } from '../../application/model/vaccine-plan.model';
import { VaccinePlanQueryPort } from '../../application/ports/vaccine-plan.query.port';
import { FindVaccinePlanOptions, PaginatedResult } from '../../application/ports/vaccine-plan.repository.port';
import { VaccinePlanNotFoundError } from '../../domain/exceptions/vaccine-plan.error';

type VaccinePlanWithRelationsRaw = Prisma.VaccinePlanGetPayload<{
  include: {
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
    vaccinationRecord: {
      select: {
        id: true;
        doseNo: true;
        administeredAt: true;
        status: true;
        nextDueDate: true;
      };
    };
  };
}>;

@Injectable()
export class VaccinePlanQueryPortImp implements VaccinePlanQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VaccinePlanModel> {
    const raw = await this.prisma.vaccinePlan.findFirst({
      where: {
        id,
        isDeleted: false,
        pet: { isDeleted: false, species: { isDeleted: false } },
        vaccine: { isDeleted: false },
      },
      include: VaccinePlanQueryPortImp.includeRelations(),
    });

    if (!raw) throw new VaccinePlanNotFoundError(id);

    return this.toModel(raw);
  }

  async findMany(options: FindVaccinePlanOptions): Promise<PaginatedResult<VaccinePlanModel>> {
    const { page, limit, search, petId, vaccineId, status, dueFrom, dueTo } = options;
    const searchValue = search?.trim();
    const petIdValue = petId?.trim();
    const vaccineIdValue = vaccineId?.trim();
    const dueDateFilter = this.buildDueDateFilter(dueFrom, dueTo);

    const where: Prisma.VaccinePlanWhereInput = {
      isDeleted: false,
      pet: {
        isDeleted: false,
        species: { isDeleted: false },
        ...(petIdValue && { id: petIdValue }),
      },
      vaccine: {
        isDeleted: false,
        ...(vaccineIdValue && { id: vaccineIdValue }),
      },
      ...(status && { status }),
      ...(dueDateFilter && { dueDate: dueDateFilter }),
      ...(searchValue && {
        OR: [
          { note: { contains: searchValue, mode: 'insensitive' } },
          { pet: { name: { contains: searchValue, mode: 'insensitive' } } },
          { pet: { breed: { contains: searchValue, mode: 'insensitive' } } },
          { vaccine: { code: { contains: searchValue, mode: 'insensitive' } } },
          { vaccine: { name: { contains: searchValue, mode: 'insensitive' } } },
          { vaccine: { brand: { contains: searchValue, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vaccinePlan.findMany({
        where,
        include: VaccinePlanQueryPortImp.includeRelations(),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vaccinePlan.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: VaccinePlanWithRelationsRaw): VaccinePlanModel {
    return {
      id: raw.id,
      pet: {
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
      },
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
      doseNo: raw.doseNo,
      dueDate: raw.dueDate,
      dueFrom: raw.dueFrom,
      dueTo: raw.dueTo,
      status: raw.status as VaccinePlanStatus,
      vaccinationRecord: raw.vaccinationRecord
        ? {
            id: raw.vaccinationRecord.id,
            doseNo: raw.vaccinationRecord.doseNo,
            administeredAt: raw.vaccinationRecord.administeredAt,
            status: raw.vaccinationRecord.status,
            nextDueDate: raw.vaccinationRecord.nextDueDate,
          }
        : null,
      completedAt: raw.completedAt,
      remindAt: raw.remindAt,
      lastRemindedAt: raw.lastRemindedAt,
      note: raw.note,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  private static includeRelations() {
    return {
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
      vaccinationRecord: {
        select: {
          id: true,
          doseNo: true,
          administeredAt: true,
          status: true,
          nextDueDate: true,
        },
      },
    } satisfies Prisma.VaccinePlanInclude;
  }

  private buildDueDateFilter(dueFrom?: Date, dueTo?: Date): Prisma.DateTimeFilter | undefined {
    if (!dueFrom && !dueTo) return undefined;

    return {
      ...(dueFrom && { gte: dueFrom }),
      ...(dueTo && { lte: dueTo }),
    };
  }
}
