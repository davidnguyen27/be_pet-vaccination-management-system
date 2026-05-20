import { VaccineLotStatus, VaccineStatus } from '@/enums/vaccine';
import { VaccineRepositoryPort } from '@/modules/vaccine/application/ports/vaccine.repository.port';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LotNoDuplicateError } from '../../domain/exceptions/lot-no.error';
import { VaccineIdInActiveError, VaccineIdNotFoundError } from '../../domain/exceptions/vaccine-id.error';
import { VaccineLotEntity } from '../../domain/vaccine-lot.entity';
import { VaccineLotModel } from '../model/vaccine-lot.model';
import { VaccineLotQueryPort } from '../ports/vaccine-lot.query.port';
import { VaccineLotRepositoryPort } from '../ports/vaccine-lot.repository.port';

export interface CreateVaccineLotCommand {
  vaccineId: string;
  lotNo: string;
  mfgDate: Date;
  expDate: Date;
  initialQuantity: number;
  quantityOnHand: number;
  storageTempMin: number;
  storageTempMax: number;
  status: VaccineLotStatus;
}

@Injectable()
export class CreateVaccineLotUseCase {
  constructor(
    private readonly vaccineLotRepo: VaccineLotRepositoryPort,
    private readonly vaccineLotQuery: VaccineLotQueryPort,
    private readonly vaccineRepo: VaccineRepositoryPort,
  ) {}

  async execute(command: CreateVaccineLotCommand): Promise<VaccineLotModel> {
    await this.ensureVaccineCanUse(command.vaccineId);

    const existingLot = await this.vaccineLotRepo.findByLotNo(command.lotNo);
    if (existingLot) throw new LotNoDuplicateError(command.lotNo);

    const vaccineLot = VaccineLotEntity.create(randomUUID(), command);
    await this.vaccineLotRepo.save(vaccineLot);

    return this.vaccineLotQuery.findById(vaccineLot.id);
  }

  private async ensureVaccineCanUse(vaccineId: string): Promise<void> {
    const vaccine = await this.vaccineRepo.findById(vaccineId);
    if (!vaccine) throw new VaccineIdNotFoundError(vaccineId);
    if (vaccine.status !== VaccineStatus.ACTIVE) throw new VaccineIdInActiveError(vaccineId);
  }
}
