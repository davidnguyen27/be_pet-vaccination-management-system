import { UserEntity } from '../../domain/user.entity';

export interface FindUserOptions {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  roleCode?: string;
}
export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findMany(options: FindUserOptions): Promise<PaginatedResult<UserEntity>>;
  abstract save(user: UserEntity): Promise<void>;
  abstract existsByEmail(email: string): Promise<boolean>;
}

export type IUserRepository = UserRepositoryPort;
