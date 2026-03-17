import { Module } from '@nestjs/common';
import { GetOwnersUseCase } from '../application/use-cases/get-owners.use-cases';
import { I_OWNER_REPOSITORY } from '../domain/i-owner.repository';
import { OwnerRepository } from '../infrastructure/owner.repository';
import { OwnerController } from './owner.controller';
import { GetOwnerByIdUseCase } from '../application/use-cases/get-owner-id.use-case';
import { UpdateOwnerUseCase } from '../application/use-cases/update-owner.use-case';

@Module({
  controllers: [OwnerController],
  providers: [
    GetOwnersUseCase,
    GetOwnerByIdUseCase,
    UpdateOwnerUseCase,
    { provide: I_OWNER_REPOSITORY, useClass: OwnerRepository },
  ],
  exports: [I_OWNER_REPOSITORY],
})
export class OwnerModule {}
