import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserDeletedError } from '../../domain/exceptions/user.error';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepo.findByIdOrThrow(userId);
    if (user.isDeleted) throw new UserDeletedError(userId);

    user.softDelete();
    await this.userRepo.save(user);
  }
}
