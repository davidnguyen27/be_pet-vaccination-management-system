import { Module } from '@nestjs/common';
import { MicrochipBatchQueryPort } from './application/ports/microchip-batch.query.port';
import { MicrochipBatchRepositoryPort } from './application/ports/microchip-batch.repository.port';
import { CreateMicrochipBatchUseCase } from './application/use-cases/create-microchip-batch.use-case';
import { DeleteMicrochipBatchUseCase } from './application/use-cases/delete-microchip-batch.use-case';
import { GetMicrochipBatchesUseCase } from './application/use-cases/get-microchip-batches.use-case';
import { UpdateMicrochipBatchUseCase } from './application/use-cases/update-microchip-batch.use-case';
import { MicrochipBatchQueryPortImp } from './infrastructure/persistence/microchip-batch.query.imp';
import { MicrochipBatchRepository } from './infrastructure/persistence/microchip-batch.repository.imp';
import { MicrochipBatchController } from './presentation/http/microchip-batch.controller';

const useCases = [
  GetMicrochipBatchesUseCase,
  CreateMicrochipBatchUseCase,
  UpdateMicrochipBatchUseCase,
  DeleteMicrochipBatchUseCase,
];

@Module({
  controllers: [MicrochipBatchController],
  providers: [
    ...useCases,
    { provide: MicrochipBatchRepositoryPort, useClass: MicrochipBatchRepository },
    { provide: MicrochipBatchQueryPort, useClass: MicrochipBatchQueryPortImp },
  ],
  exports: [MicrochipBatchRepositoryPort, MicrochipBatchQueryPort],
})
export class MicrochipBatchModule {}
