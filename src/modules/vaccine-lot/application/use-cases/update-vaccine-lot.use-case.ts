import { VaccineLotStatus, VaccineStatus } from '@/enums/vaccine';
import { VaccineRepositoryPort } from '@/modules/vaccine/application/ports/vaccine.repository.port';
import { Injectable } from '@nestjs/common';
import { LotNoDuplicateError } from '../../domain/exceptions/lot-no.error';
import { VaccineIdInActiveError, VaccineIdNotFoundError } from '../../domain/exceptions/vaccine-id.error';
import { VaccineLotModel } from '../model/vaccine-lot.model';
import { VaccineLotQueryPort } from '../ports/vaccine-lot.query.port';
import { VaccineLotRepositoryPort } from '../ports/vaccine-lot.repository.port';

export interface UpdateVaccineLotCommand {
  id: string;
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
export class UpdateVaccineLotUseCase {
  constructor(
    private readonly vaccineLotRepo: VaccineLotRepositoryPort,
    private readonly vaccineLotQuery: VaccineLotQueryPort,
    private readonly vaccineRepo: VaccineRepositoryPort,
  ) {}

  async execute(command: UpdateVaccineLotCommand): Promise<VaccineLotModel> {
    const vaccineLot = await this.vaccineLotRepo.findByIdOrThrow(command.id);

    if (command.vaccineId !== undefined && command.vaccineId !== vaccineLot.vaccineId) {
      await this.ensureVaccineCanUse(command.vaccineId);
    }

    if (command.lotNo !== undefined && command.lotNo.trim().toUpperCase() !== vaccineLot.lotNo) {
      const existingLot = await this.vaccineLotRepo.findByLotNo(command.lotNo);
      if (existingLot && existingLot.id !== command.id) {
        throw new LotNoDuplicateError(command.lotNo);
      }
    }

    vaccineLot.update({
      vaccineId: command.vaccineId,
      lotNo: command.lotNo,
      mfgDate: command.mfgDate,
      expDate: command.expDate,
      initialQuantity: command.initialQuantity,
      quantityOnHand: command.quantityOnHand,
      storageTempMin: command.storageTempMin,
      storageTempMax: command.storageTempMax,
      status: command.status,
    });

    await this.vaccineLotRepo.save(vaccineLot);

    return this.vaccineLotQuery.findById(vaccineLot.id);
  }

  private async ensureVaccineCanUse(vaccineId: string): Promise<void> {
    const vaccine = await this.vaccineRepo.findById(vaccineId);
    if (!vaccine) throw new VaccineIdNotFoundError(vaccineId);
    if (vaccine.status !== VaccineStatus.ACTIVE) throw new VaccineIdInActiveError(vaccineId);
  }
}
