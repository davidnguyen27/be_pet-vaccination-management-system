import { VaccinePlanStatus, VaccineStatus } from '@/enums/vaccine';
import { Injectable } from '@nestjs/common';
import { PetIdNotFoundError } from '../../domain/exceptions/pet-id.error';
import {
  VaccinationRecordIdDuplicateError,
  VaccinationRecordIdNotFoundError,
} from '../../domain/exceptions/vaccination-record-id.error';
import { VaccineIdInactiveError, VaccineIdNotFoundError } from '../../domain/exceptions/vaccine-id.error';
import { VaccinePlanModel } from '../model/vaccine-plan.model';
import { VaccinePlanQueryPort } from '../ports/vaccine-plan.query.port';
import { VaccinePlanRepositoryPort } from '../ports/vaccine-plan.repository.port';

export interface UpdateVaccinePlanCommand {
  id: string;
  petId?: string;
  vaccineId?: string;
  doseNo?: number;
  dueDate?: Date;
  dueFrom?: Date | null;
  dueTo?: Date | null;
  status?: VaccinePlanStatus;
  vaccinationRecordId?: string | null;
  completedAt?: Date | null;
  remindAt?: Date | null;
  lastRemindedAt?: Date | null;
  note?: string | null;
}

@Injectable()
export class UpdateVaccinePlanUseCase {
  constructor(
    private readonly vaccinePlanRepo: VaccinePlanRepositoryPort,
    private readonly vaccinePlanQuery: VaccinePlanQueryPort,
  ) {}

  async execute(command: UpdateVaccinePlanCommand): Promise<VaccinePlanModel> {
    const vaccinePlan = await this.vaccinePlanRepo.findByIdOrThrow(command.id);

    if (command.petId !== undefined && command.petId !== vaccinePlan.petId) {
      await this.ensurePetExists(command.petId);
    }

    if (command.vaccineId !== undefined && command.vaccineId !== vaccinePlan.vaccineId) {
      await this.ensureVaccineCanUse(command.vaccineId);
    }

    if (command.vaccinationRecordId !== undefined) {
      await this.ensureVaccinationRecordCanUse(command.vaccinationRecordId, vaccinePlan.id);
    }

    vaccinePlan.update({
      petId: command.petId,
      vaccineId: command.vaccineId,
      doseNo: command.doseNo,
      dueDate: command.dueDate,
      dueFrom: command.dueFrom,
      dueTo: command.dueTo,
      status: command.status,
      vaccinationRecordId: command.vaccinationRecordId,
      completedAt: command.completedAt,
      remindAt: command.remindAt,
      lastRemindedAt: command.lastRemindedAt,
      note: command.note,
    });

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

  private async ensureVaccinationRecordCanUse(
    vaccinationRecordId: string | null,
    currentPlanId: string,
  ): Promise<void> {
    const normalizedId = vaccinationRecordId?.trim();
    if (!normalizedId) return;

    if (!(await this.vaccinePlanRepo.existsVaccinationRecord(normalizedId))) {
      throw new VaccinationRecordIdNotFoundError(normalizedId);
    }

    const existingPlan = await this.vaccinePlanRepo.findByVaccinationRecordId(normalizedId);
    if (existingPlan && existingPlan.id !== currentPlanId) {
      throw new VaccinationRecordIdDuplicateError(normalizedId);
    }
  }
}
