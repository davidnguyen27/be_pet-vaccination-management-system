import { Injectable } from '@nestjs/common';
import { MicrochipRepositoryPort } from '../ports/microchip.repository.port';

@Injectable()
export class DeleteMicrochipUseCase {
  constructor(private readonly microchipRepo: MicrochipRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const microchip = await this.microchipRepo.findByIdOrThrow(id);
    microchip.softDelete();
    await this.microchipRepo.save(microchip);
  }
}
