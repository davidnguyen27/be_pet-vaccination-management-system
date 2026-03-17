import { UserResponseDto } from '../application/dtos/user-res.dto';
import { UserEntity } from '../domain/user.entity';

interface UserRaw {
  userId: string;
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
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class UserMapper {
  static toDomain(raw: UserRaw): UserEntity {
    return new UserEntity({
      id: raw.userId,
      email: raw.email,
      passwordHash: raw.password,
      fullName: raw.fullName,
      phoneNumber: raw.phoneNumber,
      avatarUrl: raw.avatarUrl,
      dob: raw.dob,
      isActive: raw.isActive,
      isDeleted: raw.isDeleted,
      // roleId: raw.roleId,
      roleCode: raw.role.code,
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }
}
