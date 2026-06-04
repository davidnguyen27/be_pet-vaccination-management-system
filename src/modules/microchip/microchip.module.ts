import { Module } from '@nestjs/common';
import { MicrochipQueryPort } from './application/ports/microchip.query.port';
import { MicrochipRepositoryPort } from './application/ports/microchip.repository.port';
import { CreateMicrochipUseCase } from './application/use-cases/create-microchip.use-case';
import { DeleteMicrochipUseCase } from './application/use-cases/delete-microchip.use-case';
import { GetMicrochipsUseCase } from './application/use-cases/get-microchips.use-case';
import { UpdateMicrochipUseCase } from './application/use-cases/update-microchip.use-case';
import { MicrochipQueryPortImp } from './infrastructure/persistence/microchip.query.imp';
import { MicrochipRepository } from './infrastructure/persistence/microchip.repository.imp';
import { MicrochipController } from './presentation/http/microchip.controller';

const useCases = [GetMicrochipsUseCase, CreateMicrochipUseCase, UpdateMicrochipUseCase, DeleteMicrochipUseCase];

@Module({
  controllers: [MicrochipController],
  providers: [
    ...useCases,
    { provide: MicrochipRepositoryPort, useClass: MicrochipRepository },
    { provide: MicrochipQueryPort, useClass: MicrochipQueryPortImp },
  ],
  exports: [MicrochipRepositoryPort, MicrochipQueryPort],
})
export class MicrochipModule {}
