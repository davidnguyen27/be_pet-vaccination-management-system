import { Injectable } from '@nestjs/common';
import { VaccinePlanRepositoryPort } from '../ports/vaccine-plan.repository.port';

@Injectable()
export class DeleteVaccinePlanUseCase {
  constructor(private readonly vaccinePlanRepo: VaccinePlanRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const vaccinePlan = await this.vaccinePlanRepo.findByIdOrThrow(id);
    vaccinePlan.softDelete();
    await this.vaccinePlanRepo.save(vaccinePlan);
  }
}
