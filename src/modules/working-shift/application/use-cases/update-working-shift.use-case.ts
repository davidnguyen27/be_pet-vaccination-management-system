import { Injectable } from '@nestjs/common';
import { VetIdNotFoundError } from '../../domain/exceptions/vet-id.error';
import { WorkingShiftOverlapError } from '../../domain/exceptions/working-shift.error';
import { WorkingShiftEntity, WorkingShiftUpdateInput } from '../../domain/working-shift.entity';
import { WorkingShiftModel } from '../model/working-shift.model';
import { WorkingShiftQueryPort } from '../ports/working-shift.query.port';
import { WorkingShiftRepositoryPort } from '../ports/working-shift.repository.port';

export interface UpdateWorkingShiftCommand extends WorkingShiftUpdateInput {
  id: string;
}

@Injectable()
export class UpdateWorkingShiftUseCase {
  constructor(
    private readonly workingShiftRepo: WorkingShiftRepositoryPort,
    private readonly workingShiftQuery: WorkingShiftQueryPort,
  ) {}

  async execute(command: UpdateWorkingShiftCommand): Promise<WorkingShiftModel> {
    const workingShift = await this.workingShiftRepo.findByIdOrThrow(command.id);

    if (command.vetId !== undefined && command.vetId.trim() !== workingShift.vetId) {
      await this.ensureVetExists(command.vetId);
    }

    workingShift.update({
      vetId: command.vetId,
      dayOfWeek: command.dayOfWeek,
      startTime: command.startTime,
      endTime: command.endTime,
      slotDuration: command.slotDuration,
      maxAppointments: command.maxAppointments,
      notes: command.notes,
    });

    await this.ensureNoOverlap(workingShift);
    await this.workingShiftRepo.save(workingShift);

    return this.workingShiftQuery.findById(workingShift.id);
  }

  private async ensureVetExists(vetId: string): Promise<void> {
    if (!(await this.workingShiftRepo.existsVet(vetId))) {
      throw new VetIdNotFoundError(vetId);
    }
  }

  private async ensureNoOverlap(workingShift: WorkingShiftEntity): Promise<void> {
    const overlaps = await this.workingShiftRepo.existsOverlappingShift({
      vetId: workingShift.vetId,
      dayOfWeek: workingShift.dayOfWeek,
      startTime: workingShift.startTime,
      endTime: workingShift.endTime,
      excludeId: workingShift.id,
    });

    if (overlaps) throw new WorkingShiftOverlapError();
  }
}
