import { Module } from '@nestjs/common';
import { I_USER_REPOSITORY } from '../domain/i-user.repository';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '../application/use-cases/get-users.use-case';
import { UserRepository } from '../infrastructure/user.repository';
import { UserController } from './user.controller';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { I_AUTH_REPOSITORY } from '@/modules/auth/domain/i-auth.repository';
import { AuthRepository } from '@/modules/auth/infrastructure/repositories/auth.repository';
import { I_EMAIL_SERVICE } from '@/modules/auth/application/ports/i-email.service';
import { NodemailerService } from '@/modules/auth/infrastructure/services/nodemailer.service';

const useCases = [CreateUserUseCase, GetAllUsersUseCase, GetUserByIdUseCase, UpdateUserUseCase, DeleteUserUseCase];

@Module({
  controllers: [UserController],
  providers: [
    ...useCases,
    { provide: I_USER_REPOSITORY, useClass: UserRepository },
    { provide: I_AUTH_REPOSITORY, useClass: AuthRepository },
    { provide: I_EMAIL_SERVICE, useClass: NodemailerService },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
