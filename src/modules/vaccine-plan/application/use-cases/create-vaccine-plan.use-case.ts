import { VaccinePlanStatus, VaccineStatus } from '@/enums/vaccine';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PetIdNotFoundError } from '../../domain/exceptions/pet-id.error';
import {
  VaccinationRecordIdDuplicateError,
  VaccinationRecordIdNotFoundError,
} from '../../domain/exceptions/vaccination-record-id.error';
import { VaccineIdInactiveError, VaccineIdNotFoundError } from '../../domain/exceptions/vaccine-id.error';
import { VaccinePlanEntity } from '../../domain/vaccine-plan.entity';
import { VaccinePlanModel } from '../model/vaccine-plan.model';
import { VaccinePlanQueryPort } from '../ports/vaccine-plan.query.port';
import { VaccinePlanRepositoryPort } from '../ports/vaccine-plan.repository.port';

export interface CreateVaccinePlanCommand {
  petId: string;
  vaccineId: string;
  doseNo: number;
  dueDate: Date;
  dueFrom?: Date | null;
  dueTo?: Date | null;
  status: VaccinePlanStatus;
  vaccinationRecordId?: string | null;
  completedAt?: Date | null;
  remindAt?: Date | null;
  lastRemindedAt?: Date | null;
  note?: string | null;
}

@Injectable()
export class CreateVaccinePlanUseCase {
  constructor(
    private readonly vaccinePlanRepo: VaccinePlanRepositoryPort,
    private readonly vaccinePlanQuery: VaccinePlanQueryPort,
  ) {}

  async execute(command: CreateVaccinePlanCommand): Promise<VaccinePlanModel> {
    await this.ensurePetExists(command.petId);
    await this.ensureVaccineCanUse(command.vaccineId);
    await this.ensureVaccinationRecordCanUse(command.vaccinationRecordId);

    const vaccinePlan = VaccinePlanEntity.create(randomUUID(), command);
    await this.vaccinePlanRepo.save(vaccinePlan);

    return this.vaccinePlanQuery.findById(vaccinePlan.id);
  }

  private async ensurePetExists(petId: string): Promise<void> {
    if (!(await this.vaccinePlanRepo.existsPet(petId))) {
      throw new PetIdNotFoundError(petId);
    }
  }

  private async ensureVaccineCanUse(vaccineId: string): Promise<void> {
    const vaccineStatus = await this.vaccinePlanRepo.findVaccineStatus(vaccineId);
    if (!vaccineStatus) throw new VaccineIdNotFoundError(vaccineId);
    if (vaccineStatus !== VaccineStatus.ACTIVE) throw new VaccineIdInactiveError(vaccineId);
  }

  private async ensureVaccinationRecordCanUse(vaccinationRecordId?: string | null): Promise<void> {
    const normalizedId = vaccinationRecordId?.trim();
    if (!normalizedId) return;

    if (!(await this.vaccinePlanRepo.existsVaccinationRecord(normalizedId))) {
      throw new VaccinationRecordIdNotFoundError(normalizedId);
    }

    const existingPlan = await this.vaccinePlanRepo.findByVaccinationRecordId(normalizedId);
    if (existingPlan) throw new VaccinationRecordIdDuplicateError(normalizedId);
  }
}
