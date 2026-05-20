import { VaccineLotModel } from '@/modules/vaccine-lot/application/model/vaccine-lot.model';
import { VaccineLotResponseDTO } from '../dto/vaccine-lot-response.dto';

export class VaccineLotHttpMapper {
  static toResponse(vaccineLot: VaccineLotModel): VaccineLotResponseDTO {
    return {
      id: vaccineLot.id,
      vaccine: vaccineLot.vaccine,
      lotNo: vaccineLot.lotNo,
      mfgDate: vaccineLot.mfgDate,
      expDate: vaccineLot.expDate,
      initialQuantity: vaccineLot.initialQuantity,
      quantityOnHand: vaccineLot.quantityOnHand,
      storageTempMin: vaccineLot.storageTempMin,
      storageTempMax: vaccineLot.storageTempMax,
      status: vaccineLot.status,
      isDeleted: vaccineLot.isDeleted,
      createdAt: vaccineLot.createdAt,
      updatedAt: vaccineLot.updatedAt,
      deletedAt: vaccineLot.deletedAt,
    };
  }

  static toResponseList(items: VaccineLotModel[]): VaccineLotResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
