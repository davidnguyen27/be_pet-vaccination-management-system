import { EmploymentStatus } from '@/enums';
import { Prisma } from '../../../../../generated/prisma/client';
import { VetEntity } from '../../domain/vet.entity';

export type VetRaw = Prisma.VetProfileGetPayload<object>;

export class VetMapper {
  static toDomain(raw: VetRaw): VetEntity {
    return VetEntity.reconstitute(raw.id, {
      userId: raw.userId,
      bio: raw.bio,
      licenseNo: raw.licenseNo,
      licenseIssueBy: raw.licenseIssueBy,
      licenseValidFrom: raw.licenseValidFrom,
      licenseValidTo: raw.licenseValidTo,
      joinDate: raw.joinDate,
      endDate: raw.endDate,
      address: raw.address,
      citizenId: raw.citizenId,
      employmentStatus: raw.employmentStatus as EmploymentStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrismaCreate(vet: VetEntity) {
    return {
      id: vet.id,
      userId: vet.userId,
      bio: vet.bio,
      licenseNo: vet.licenseNo,
      licenseIssueBy: vet.licenseIssueBy,
      licenseValidFrom: vet.licenseValidFrom,
      licenseValidTo: vet.licenseValidTo,
      joinDate: vet.joinDate,
      endDate: vet.endDate,
      address: vet.address,
      citizenId: vet.citizenId,
      employmentStatus: vet.employmentStatus,
      createdAt: vet.createdAt,
      updatedAt: vet.updatedAt,
    };
  }

  static toPrismaUpdate(vet: VetEntity) {
    return {
      bio: vet.bio,
      licenseNo: vet.licenseNo,
      licenseIssueBy: vet.licenseIssueBy,
      licenseValidFrom: vet.licenseValidFrom,
      licenseValidTo: vet.licenseValidTo,
      joinDate: vet.joinDate,
      endDate: vet.endDate,
      address: vet.address,
      citizenId: vet.citizenId,
      employmentStatus: vet.employmentStatus,
      updatedAt: vet.updatedAt,
    };
  }
}
