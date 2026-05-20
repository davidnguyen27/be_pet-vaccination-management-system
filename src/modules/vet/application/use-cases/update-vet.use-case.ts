import { Injectable } from '@nestjs/common';
import { VetEntity } from '../../domain/vet.entity';
import { VetRepositoryPort } from '../ports/vet.repository.port';
import { EmploymentStatus } from '@/enums';

interface UpdateVetCommand {
  userId: string;
  bio?: string;
  licenseNo?: string;
  licenseIssueBy?: string;
  licenseValidFrom?: string;
  licenseValidTo?: string;
  joinDate?: string;
  endDate?: string | null;
  address?: string;
  citizenId?: string;
  employmentStatus?: EmploymentStatus;
}

@Injectable()
export class UpdateVetUseCase {
  constructor(private readonly vetRepo: VetRepositoryPort) {}

  async execute(command: UpdateVetCommand): Promise<VetEntity> {
    const vet = await this.vetRepo.findByUserIdOrThrow(command.userId);

    vet.update({
      bio: command.bio,
      address: command.address,
      citizenId: command.citizenId,
      employmentStatus: command.employmentStatus,
      joinDate: command.joinDate !== undefined ? new Date(command.joinDate) : undefined,
      endDate: command.endDate !== undefined ? (command.endDate ? new Date(command.endDate) : null) : undefined,
      licenseIssueBy: command.licenseIssueBy,
      licenseNo: command.licenseNo,
      licenseValidFrom: command.licenseValidFrom !== undefined ? new Date(command.licenseValidFrom) : undefined,
      licenseValidTo: command.licenseValidTo !== undefined ? new Date(command.licenseValidTo) : undefined,
    });

    await this.vetRepo.save(vet);

    return vet;
  }
}
