import { Inject, Injectable } from '@nestjs/common';
import { I_USER_REPOSITORY, IUserRepository } from '../../domain/i-user.repository';
import { UserQueryDto } from '../dtos/user-query.dto';
import { UserResponseDto } from '../dtos/user-res.dto';
import { PaginationDto } from '@/shared/application/pagination.dto';
import { UserMapper } from '../../infrastructure/user.mapper';
import { ActiveStatus } from '@/enums/user';

@Injectable()
export class GetAllUsersUseCase {
  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(query: UserQueryDto): Promise<PaginationDto<UserResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const activeStatus = query.isActive === undefined ? undefined : query.isActive === ActiveStatus.ACTIVE;

    const result = await this.userRepo.findAll({
      page,
      limit,
      search: query.search,
      roleCode: query.roleCode,
      isActive: activeStatus,
    });

    const users = result.data.map(user => UserMapper.toResponse(user));

    return new PaginationDto(users, { total: result.total, page, limit });
  }
}
