import { OwnerRaw } from '@/modules/owner/infrastructure/owner.mapper';
import { UserResponseDto } from '../application/dtos/user-res.dto';
import { UserEntity } from '../domain/user.entity';
import { VetRaw } from '@/modules/vet/infrastructure/vet.mapper';
import { StaffRaw } from '@/modules/staff/infrastructure/staff.mapper';
import { OwnerMapper } from '@/modules/owner/infrastructure/owner.mapper';
import { VetMapper } from '@/modules/vet/infrastructure/vet.mapper';
import { StaffMapper } from '@/modules/staff/infrastructure/staff.mapper';

interface UserRaw {
  id: string;
  email: string;
  password: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dob?: Date | null;
  isActive: boolean;
  isDeleted: boolean;
  role: {
    code: string;
  };
  ownerProfile?: Omit<OwnerRaw, 'user'> | null;
  vetProfile?: Omit<VetRaw, 'user'> | null;
  staffProfile?: Omit<StaffRaw, 'user'> | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class UserMapper {
  static toDomain(raw: UserRaw): UserEntity {
    const profileUser = {
      id: raw.id,
      email: raw.email,
      fullName: raw.fullName,
      phoneNumber: raw.phoneNumber,
      avatarUrl: raw.avatarUrl,
      dob: raw.dob,
      isActive: raw.isActive,
      isDeleted: raw.isDeleted,
      role: {
        code: raw.role.code,
      },
    };

    return new UserEntity({
      id: raw.id,
      email: raw.email,
      passwordHash: raw.password,
      fullName: raw.fullName,
      phoneNumber: raw.phoneNumber,
      avatarUrl: raw.avatarUrl,
      dob: raw.dob,
      isActive: raw.isActive,
      isDeleted: raw.isDeleted,
      roleCode: raw.role.code,
      owner: raw.ownerProfile
        ? OwnerMapper.toDomain({
            ...raw.ownerProfile,
            user: profileUser,
          })
        : null,
      vet: raw.vetProfile
        ? VetMapper.toDomain({
            ...raw.vetProfile,
            user: profileUser,
          })
        : null,
      staff: raw.staffProfile
        ? StaffMapper.toDomain({
            ...raw.staffProfile,
            user: profileUser,
          })
        : null,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toResponse(user: UserEntity): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      email: user.email,
      roleCode: user.roleCode,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      dob: user.dob,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      lastLoginAt: user.lastLoginAt,
      owner: user.owner ? OwnerMapper.toResponse(user.owner) : null,
      vet: user.vet ? VetMapper.toResponse(user.vet) : null,
      staff: user.staff ? StaffMapper.toResponse(user.staff) : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }
}
