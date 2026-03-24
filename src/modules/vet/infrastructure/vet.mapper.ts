import { employment_status } from '@/enums';
import { VetEntity } from '../domain/vet.entity';
import { VetResponseDto } from '../application/dtos/vet-res.dto';
import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';

export interface VetRaw {
  id: string;
  userId: string;
  user: {
    id: string;
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
  bio: string;
  licenseNo: string;
  licenseIssueBy: string;
  licenseValidFrom: Date;
  licenseValidTo: Date;
  joinDate: Date;
  endDate: Date | null;
  address: string;
  citizenId: string;
  employmentStatus: employment_status | 'WORKING' | 'ON_LEAVE';
  createdAt: Date;
  updatedAt: Date;
}

export class VetMapper {
  static toDomain(raw: VetRaw): VetEntity {
    return new VetEntity({
      id: raw.id,
      user: {
        id: raw.user.id,
        email: raw.user.email,
        fullName: raw.user.fullName,
        phoneNumber: raw.user.phoneNumber,
        avatarUrl: raw.user.avatarUrl,
        dob: raw.user.dob,
        isActive: raw.user.isActive,
        isDeleted: raw.user.isDeleted,
        roleCode: raw.user.role?.code ?? '',
      } as VetEntity['user'],
      bio: raw.bio,
      licenseNo: raw.licenseNo,
      licenseIssueBy: raw.licenseIssueBy,
      licenseValidFrom: raw.licenseValidFrom,
      licenseValidTo: raw.licenseValidTo,
      joinDate: raw.joinDate,
      endDate: raw.endDate,
      address: raw.address,
      citizenId: raw.citizenId,
      employmentStatus: raw.employmentStatus as employment_status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toResponse(vet: VetEntity): VetResponseDto {
    return new VetResponseDto({
      id: vet.id,
      user: new UserResponseDto({
        id: vet.user.id,
        email: vet.user.email,
        fullName: vet.user.fullName,
        phoneNumber: vet.user.phoneNumber,
        avatarUrl: vet.user.avatarUrl,
        dob: vet.user.dob,
        isActive: vet.user.isActive,
        isDeleted: vet.user.isDeleted,
        roleCode: vet.user.roleCode,
      }),
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
    });
  }
}
