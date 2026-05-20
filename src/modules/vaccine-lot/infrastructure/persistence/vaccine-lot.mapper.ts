import { VaccineLotStatus } from '@/enums/vaccine';
import { Prisma } from '../../../../../generated/prisma/client';
import { VaccineLotEntity } from '../../domain/vaccine-lot.entity';

export type VaccineLotRaw = Prisma.VaccineLotGetPayload<object>;

export class VaccineLotPrismaMapper {
  static toDomain(raw: VaccineLotRaw): VaccineLotEntity {
    return VaccineLotEntity.reconstitute(raw.id, {
      vaccineId: raw.vaccineId,
      lotNo: raw.lotNo,
      mfgDate: raw.mfgDate,
      expDate: raw.expDate,
      initialQuantity: raw.initialQuantity,
      quantityOnHand: raw.quantityOnHand,
      storageTempMin: raw.storageTempMin,
      storageTempMax: raw.storageTempMax,
      status: raw.status as VaccineLotStatus,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrismaCreate(vaccineLot: VaccineLotEntity) {
    return {
      id: vaccineLot.id,
      vaccineId: vaccineLot.vaccineId,
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

  static toPrismaUpdate(vaccineLot: VaccineLotEntity) {
    return {
      vaccineId: vaccineLot.vaccineId,
      lotNo: vaccineLot.lotNo,
      mfgDate: vaccineLot.mfgDate,
      expDate: vaccineLot.expDate,
      initialQuantity: vaccineLot.initialQuantity,
      quantityOnHand: vaccineLot.quantityOnHand,
      storageTempMin: vaccineLot.storageTempMin,
      storageTempMax: vaccineLot.storageTempMax,
      status: vaccineLot.status,
      isDeleted: vaccineLot.isDeleted,
      updatedAt: vaccineLot.updatedAt,
      deletedAt: vaccineLot.deletedAt,
    };
  }
}
