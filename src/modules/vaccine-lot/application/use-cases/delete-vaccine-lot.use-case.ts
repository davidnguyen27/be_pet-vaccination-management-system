import { Injectable } from '@nestjs/common';
import { VaccineLotRepositoryPort } from '../ports/vaccine-lot.repository.port';

@Injectable()
export class DeleteVaccineLotUseCase {
  constructor(private readonly vaccineLotRepo: VaccineLotRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const vaccineLot = await this.vaccineLotRepo.findByIdOrThrow(id);
    vaccineLot.softDelete();
    await this.vaccineLotRepo.save(vaccineLot);
  }
}
