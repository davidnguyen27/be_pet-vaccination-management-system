import { Module } from '@nestjs/common';
import { UserController } from './presentation/http/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UserRepositoryPort } from './application/ports/user.repository.port';
import { UserRepositoryImpl } from './infrastructure/persistence/user.repository.imp';
import { CloudinaryModule } from '@/shared/infrastructure/cloudinary/cloudinary.module';

const useCases = [GetUserUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase];

@Module({
  imports: [CloudinaryModule],
  controllers: [UserController],
  providers: [...useCases, { provide: UserRepositoryPort, useClass: UserRepositoryImpl }],
  exports: [UserRepositoryPort],
})
export class UserModule {}
