import { RoleCode } from '@/enums';
import { UserEntity } from './user.entity';
import { employment_status, employment_type } from '@/enums';

export const I_USER_REPOSITORY = Symbol('IUserRepository');

export interface CreateStaffProfileData {
  code: string;
  jobTitle?: string;
  department?: string;
  employmentType?: employment_type;
  employmentStatus?: employment_status;
  joinDate: Date;
  endDate?: Date | null;
  address: string;
  citizenId: string;
  notes?: string;
}

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
  staffProfile?: CreateStaffProfileData;
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
  findAll(filter: GetUsersFilter): Promise<PaginatedResult<UserEntity>>;
  ensureOwnerProfile(userId: string): Promise<void>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(user: UpdateUserData): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
