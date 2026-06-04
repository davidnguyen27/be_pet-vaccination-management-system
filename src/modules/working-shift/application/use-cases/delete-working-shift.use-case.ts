import { Injectable } from '@nestjs/common';
import { WorkingShiftRepositoryPort } from '../ports/working-shift.repository.port';

@Injectable()
export class DeleteWorkingShiftUseCase {
  constructor(private readonly workingShiftRepo: WorkingShiftRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const workingShift = await this.workingShiftRepo.findByIdOrThrow(id);
    workingShift.softDelete();
    await this.workingShiftRepo.save(workingShift);
  }
}
