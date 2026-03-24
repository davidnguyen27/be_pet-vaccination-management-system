import { RoleCode } from '@/enums';
import { UserEntity } from './user.entity';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';
import { Params } from '@/shared/domain/query-params.type';

export const I_USER_REPOSITORY = Symbol('IUserRepository');

export interface CreateUserData {
  id?: string;
  email: string;
  passwordHash: string;
  roleCode: RoleCode;
  isActive?: boolean;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  dob?: Date | null;
}

export interface UpdateUserData {
  id: string;
  email?: string;
  passwordHash?: string;
  roleCode?: RoleCode;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  dob?: Date | null;
}

export interface GetUsersFilter extends Params {
  roleCode?: RoleCode;
  isActive?: boolean;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(filter: GetUsersFilter): Promise<PaginatedResult<UserEntity>>;
  ensureOwnerProfile(userId: string): Promise<void>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(user: UpdateUserData): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
