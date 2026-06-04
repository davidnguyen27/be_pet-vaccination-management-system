import { WorkingShiftModel } from '../../../application/model/working-shift.model';
import { WorkingShiftResponseDTO } from '../dto/working-shift-response.dto';

export class WorkingShiftHttpMapper {
  static toResponse(workingShift: WorkingShiftModel): WorkingShiftResponseDTO {
    return {
      id: workingShift.id,
      vet: workingShift.vet,
      dayOfWeek: workingShift.dayOfWeek,
      startTime: workingShift.startTime,
      endTime: workingShift.endTime,
      slotDuration: workingShift.slotDuration,
      maxAppointments: workingShift.maxAppointments,
      notes: workingShift.notes,
      isDeleted: workingShift.isDeleted,
      createdAt: workingShift.createdAt,
      updatedAt: workingShift.updatedAt,
      deletedAt: workingShift.deletedAt,
    };
  }

  static toResponseList(items: WorkingShiftModel[]): WorkingShiftResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
