import { Injectable } from '@nestjs/common';
import { VaccineRepositoryPort } from '../ports/vaccine.repository.port';

@Injectable()
export class DeleteVaccineUseCase {
  constructor(private readonly vaccineRepo: VaccineRepositoryPort) {}

  async execute(id: string) {
    const vaccine = await this.vaccineRepo.findByIdOrThrow(id);
    vaccine.softDelete();
    await this.vaccineRepo.save(vaccine);
  }
}
