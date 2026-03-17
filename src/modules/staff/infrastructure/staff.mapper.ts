import { employment_status, employment_type } from '@/enums';
import { StaffEntity } from '../domain/staff.entity';
import { StaffResponseDto } from '../application/dtos/staff-res.dto';
import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';

interface StaffRaw {
  profileId: string;
  userId: string;
  user: {
    userId: string;
    email: string;
    fullName?: string | null;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    dob?: Date | null;
    isActive: boolean;
    isDeleted: boolean;
    role?: {
      code: string;
    };
  };
  code: string;
  jobTitle: string | null;
  department: string | null;
  employmentType: employment_type;
  employmentStatus: employment_status;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class StaffMapper {
  static toDomain(raw: StaffRaw): StaffEntity {
    return new StaffEntity({
      id: raw.profileId,
      user: {
        id: raw.user.userId,
        email: raw.user.email,
        fullName: raw.user.fullName,
        phoneNumber: raw.user.phoneNumber,
        avatarUrl: raw.user.avatarUrl,
        dob: raw.user.dob,
        isActive: raw.user.isActive,
        isDeleted: raw.user.isDeleted,
        roleCode: raw.user.role?.code ?? '',
      } as StaffEntity['user'],
      code: raw.code,
      jobTitle: raw.jobTitle,
      department: raw.department,
      employmentType: raw.employmentType,
      employmentStatus: raw.employmentStatus,
      joinDate: raw.joinDate,
      endDate: raw.endDate,
      address: raw.address,
      citizenId: raw.citizenId,
      notes: raw.notes,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toResponse(staff: StaffEntity): StaffResponseDto {
    return new StaffResponseDto({
      profileId: staff.id,
      user: new UserResponseDto({
        id: staff.user.id,
        email: staff.user.email,
        fullName: staff.user.fullName ?? null,
        phoneNumber: staff.user.phoneNumber ?? null,
        avatarUrl: staff.user.avatarUrl ?? null,
        dob: staff.user.dob ?? null,
        roleCode: staff.user.roleCode,
        isActive: staff.user.isActive,
      }),
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
    });
  }
}
