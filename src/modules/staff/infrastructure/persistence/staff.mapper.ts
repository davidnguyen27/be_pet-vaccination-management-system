import { EmploymentStatus, employment_type } from '@/enums';
import { Prisma } from '../../../../../generated/prisma/client';
import { StaffEntity } from '../../domain/staff.entity';

export type StaffRaw = Prisma.StaffProfileGetPayload<object>;

export class StaffMapper {
  static toDomain(raw: StaffRaw): StaffEntity {
    return StaffEntity.reconstitute(raw.id, {
      userId: raw.userId,
      code: raw.code,
      jobTitle: raw.jobTitle,
      department: raw.department,
      employmentType: raw.employmentType as employment_type,
      employmentStatus: raw.employmentStatus as EmploymentStatus,
      joinDate: raw.joinDate,
      endDate: raw.endDate,
      address: raw.address,
      citizenId: raw.citizenId,
      notes: raw.notes,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrismaCreate(staff: StaffEntity) {
    return {
      id: staff.id,
      userId: staff.userId,
      code: staff.code,
      jobTitle: staff.jobTitle,
      department: staff.department,
      employmentType: staff.employmentType,
      employmentStatus: staff.employmentStatus,
      joinDate: staff.joinDate,
      endDate: staff.endDate,
      address: staff.address,
      citizenId: staff.citizenId,
      notes: staff.notes,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }

  static toPrismaUpdate(staff: StaffEntity) {
    return {
      code: staff.code,
      jobTitle: staff.jobTitle,
      department: staff.department,
      employmentType: staff.employmentType,
      employmentStatus: staff.employmentStatus,
      joinDate: staff.joinDate,
      endDate: staff.endDate,
      address: staff.address,
      citizenId: staff.citizenId,
      notes: staff.notes,
      updatedAt: staff.updatedAt,
    };
  }
}
