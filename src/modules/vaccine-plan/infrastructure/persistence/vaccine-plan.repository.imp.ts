import { VaccineStatus } from '@/enums/vaccine';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  FindVaccinePlanOptions,
  PaginatedResult,
  VaccinePlanRepositoryPort,
} from '../../application/ports/vaccine-plan.repository.port';
import { VaccinePlanNotFoundError } from '../../domain/exceptions/vaccine-plan.error';
import { VaccinePlanEntity } from '../../domain/vaccine-plan.entity';
import { VaccinePlanPrismaMapper } from './vaccine-plan.mapper';

@Injectable()
export class VaccinePlanRepository implements VaccinePlanRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VaccinePlanEntity | null> {
    const raw = await this.prisma.vaccinePlan.findFirst({
      where: { id, isDeleted: false },
    });

    return raw ? VaccinePlanPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<VaccinePlanEntity> {
    const vaccinePlan = await this.findById(id);
    if (!vaccinePlan) throw new VaccinePlanNotFoundError(id);
    return vaccinePlan;
  }

  async findByVaccinationRecordId(vaccinationRecordId: string): Promise<VaccinePlanEntity | null> {
    const normalizedId = vaccinationRecordId.trim();
    if (!normalizedId) return null;

    const raw = await this.prisma.vaccinePlan.findFirst({
      where: { vaccinationRecordId: normalizedId, isDeleted: false },
    });

    return raw ? VaccinePlanPrismaMapper.toDomain(raw) : null;
  }

  async findMany(options: FindVaccinePlanOptions): Promise<PaginatedResult<VaccinePlanEntity>> {
    const { page, limit, search, petId, vaccineId, status, dueFrom, dueTo } = options;
    const searchValue = search?.trim();
    const petIdValue = petId?.trim();
    const vaccineIdValue = vaccineId?.trim();
    const dueDateFilter = this.buildDueDateFilter(dueFrom, dueTo);

    const where: Prisma.VaccinePlanWhereInput = {
      isDeleted: false,
      ...(petIdValue && { petId: petIdValue }),
      ...(vaccineIdValue && { vaccineId: vaccineIdValue }),
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vaccinePlan.count({ where }),
    ]);

    return {
      items: raws.map(raw => VaccinePlanPrismaMapper.toDomain(raw)),
      totalItems,
    };
  }

  async existsPet(petId: string): Promise<boolean> {
    const normalizedId = petId.trim();
    if (!normalizedId) return false;

    const count = await this.prisma.pet.count({
      where: {
        id: normalizedId,
        isDeleted: false,
        species: { isDeleted: false },
      },
    });

    return count > 0;
  }

  async findVaccineStatus(vaccineId: string): Promise<VaccineStatus | null> {
    const normalizedId = vaccineId.trim();
    if (!normalizedId) return null;

    const vaccine = await this.prisma.vaccine.findFirst({
      where: { id: normalizedId, isDeleted: false },
      select: { status: true },
    });

    return vaccine ? (vaccine.status as VaccineStatus) : null;
  }

  async existsVaccinationRecord(vaccinationRecordId: string): Promise<boolean> {
    const normalizedId = vaccinationRecordId.trim();
    if (!normalizedId) return false;

    const count = await this.prisma.vaccinationRecord.count({
      where: { id: normalizedId },
    });

    return count > 0;
  }

  async save(vaccinePlan: VaccinePlanEntity): Promise<void> {
    await this.prisma.vaccinePlan.upsert({
      where: { id: vaccinePlan.id },
      create: VaccinePlanPrismaMapper.toPrismaCreate(vaccinePlan),
      update: VaccinePlanPrismaMapper.toPrismaUpdate(vaccinePlan),
    });
  }

  private buildDueDateFilter(dueFrom?: Date, dueTo?: Date): Prisma.DateTimeFilter | undefined {
    if (!dueFrom && !dueTo) return undefined;

    return {
      ...(dueFrom && { gte: dueFrom }),
      ...(dueTo && { lte: dueTo }),
    };
  }
}
