import { Injectable } from '@nestjs/common';
import { FindUserOptions, UserRepositoryPort } from '../ports/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { Meta } from '@/shared/application/response.dto';

interface GetUserResult {
  items: UserEntity[];
  meta: Meta;
}

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async getById(id: string) {
    const user = await this.userRepo.findByIdOrThrow(id);
    return user;
  }

  async getMany(options: FindUserOptions): Promise<GetUserResult> {
    const { items, total } = await this.userRepo.findMany(options);

    return {
      items,
      meta: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }
}
