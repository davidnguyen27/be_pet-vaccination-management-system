import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { VetIdNotFoundError } from '../../domain/exceptions/vet-id.error';
import { WorkingShiftOverlapError } from '../../domain/exceptions/working-shift.error';
import { WorkingShiftEntity, WorkingShiftInput } from '../../domain/working-shift.entity';
import { WorkingShiftModel } from '../model/working-shift.model';
import { WorkingShiftQueryPort } from '../ports/working-shift.query.port';
import { WorkingShiftRepositoryPort } from '../ports/working-shift.repository.port';

export type CreateWorkingShiftCommand = WorkingShiftInput;

@Injectable()
export class CreateWorkingShiftUseCase {
  constructor(
    private readonly workingShiftRepo: WorkingShiftRepositoryPort,
    private readonly workingShiftQuery: WorkingShiftQueryPort,
  ) {}

  async execute(command: CreateWorkingShiftCommand): Promise<WorkingShiftModel> {
    await this.ensureVetExists(command.vetId);

    const workingShift = WorkingShiftEntity.create(randomUUID(), command);
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
    });

    if (overlaps) throw new WorkingShiftOverlapError();
  }
}
