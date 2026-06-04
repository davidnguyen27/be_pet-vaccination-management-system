import { VaccinePlanModel } from '../../../application/model/vaccine-plan.model';
import { VaccinePlanResponseDTO } from '../dto/vaccine-plan-response.dto';

export class VaccinePlanHttpMapper {
  static toResponse(vaccinePlan: VaccinePlanModel): VaccinePlanResponseDTO {
    return {
      id: vaccinePlan.id,
      pet: vaccinePlan.pet,
      vaccine: vaccinePlan.vaccine,
      doseNo: vaccinePlan.doseNo,
      dueDate: vaccinePlan.dueDate,
      dueFrom: vaccinePlan.dueFrom,
      dueTo: vaccinePlan.dueTo,
      status: vaccinePlan.status,
      vaccinationRecord: vaccinePlan.vaccinationRecord,
      completedAt: vaccinePlan.completedAt,
      remindAt: vaccinePlan.remindAt,
      lastRemindedAt: vaccinePlan.lastRemindedAt,
      note: vaccinePlan.note,
      isDeleted: vaccinePlan.isDeleted,
      createdAt: vaccinePlan.createdAt,
      updatedAt: vaccinePlan.updatedAt,
      deletedAt: vaccinePlan.deletedAt,
    };
  }

  static toResponseList(items: VaccinePlanModel[]): VaccinePlanResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
