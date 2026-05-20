import { SetMetadata } from '@nestjs/common';
import { RoleCode } from '../../../../generated/prisma/enums';
// import type { RoleCode } from 'generated/prisma/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleCode[]): ReturnType<typeof SetMetadata> => SetMetadata(ROLES_KEY, roles);
