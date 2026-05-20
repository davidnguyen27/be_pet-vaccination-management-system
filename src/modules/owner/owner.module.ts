import { Module } from '@nestjs/common';
import { GetOwnersUseCase } from './application/use-cases/get-owners.use-cases';
import { OwnerController } from './presentation/http/owner.controller';
import { UpdateOwnerUseCase } from './application/use-cases/update-owner.use-case';
import { OwnerRepositoryPort } from './application/ports/owner.repository.port';
import { OwnerRepositoryImp } from './infrastructure/persistence/owner.repository.imp';
import { OwnerQueryPort } from './application/ports/owner.query.port';
import { OwnerQueryImp } from './infrastructure/persistence/owner.query.imp';

@Module({
  controllers: [OwnerController],
  providers: [
    GetOwnersUseCase,
    UpdateOwnerUseCase,
    { provide: OwnerRepositoryPort, useClass: OwnerRepositoryImp },
    { provide: OwnerQueryPort, useClass: OwnerQueryImp },
  ],
  exports: [OwnerRepositoryPort, OwnerQueryPort],
})
export class OwnerModule {}
