import { VaccineModel } from '@/modules/vaccine/application/model/vaccine.model';
import { VaccineResponseDTO } from '../dto/vaccine-response.dto';

export class VaccineHttpMapper {
  static toResponse(vaccine: VaccineModel): VaccineResponseDTO {
    return {
      id: vaccine.id,
      species: vaccine.species,
      code: vaccine.code,
      name: vaccine.name,
      brand: vaccine.brand,
      imgUrl: vaccine.imgUrl,
      description: vaccine.description,
      doseValue: vaccine.doseValue,
      doseUnit: vaccine.doseUnit,
      status: vaccine.status,
      defaultTotalDoses: vaccine.defaultTotalDoses,
      defaultNextDueDays: vaccine.defaultNextDueDays,
      isDeleted: vaccine.isDeleted,
      createdAt: vaccine.createdAt,
      updatedAt: vaccine.updatedAt,
      deletedAt: vaccine.deletedAt,
    };
  }

  static toResponseList(items: VaccineModel[]): VaccineResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
