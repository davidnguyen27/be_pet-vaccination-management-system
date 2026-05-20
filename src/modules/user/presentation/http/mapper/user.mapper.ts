import { RoleCode } from '@/enums';
import { UserEntity } from '../../../domain/user.entity';
import { UserResponseDTO } from '../dto/user-response.dto';

const ROLE_NAMES: Record<RoleCode, string> = {
  [RoleCode.ADMIN]: 'Admin',
  [RoleCode.STAFF]: 'Staff',
  [RoleCode.VET]: 'Veterinarian',
  [RoleCode.OWN]: 'Owner',
};

const toRoleName = (roleCode: string) => {
  const code = roleCode as RoleCode;

  return ROLE_NAMES[code] ?? roleCode;
};

export class UserHttpMapper {
  static toResponse(entity: UserEntity): UserResponseDTO {
    return {
      id: entity.id,
      role: toRoleName(entity.roleCode),
      email: entity.email,
      fullName: entity.fullName,
      phoneNumber: entity.phoneNumber,
      avatarUrl: entity.avatarUrl,
      dob: entity.dob?.toISOString() ?? null,
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
      lastLoginAt: entity.lastLoginAt?.toISOString() ?? null,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString() ?? null,
    };
  }

  static toResponseList(entities: UserEntity[]): UserResponseDTO[] {
    return entities.map(this.toResponse.bind(this));
  }
}
