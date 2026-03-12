import { RoleCode } from '@/enums';
import { UserEntity } from './user.entity';

export const I_USER_REPOSITORY = Symbol('IUserRepository');

export interface CreateUserData {
  id?: string;
  email: string;
  passwordHash: string;
  roleCode: RoleCode;
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

export interface GetUsersFilter {
  page: number;
  limit: number;
  search?: string;
  roleCode?: RoleCode;
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  findAllWithFilters(filter: GetUsersFilter): Promise<PaginatedResult<UserEntity>>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(user: UpdateUserData): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
