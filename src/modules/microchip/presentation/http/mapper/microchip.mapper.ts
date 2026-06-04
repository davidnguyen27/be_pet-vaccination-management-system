import { MicrochipModel } from '../../../application/model/microchip.model';
import { MicrochipResponseDTO } from '../dto/microchip-response.dto';

export class MicrochipHttpMapper {
  static toResponse(microchip: MicrochipModel): MicrochipResponseDTO {
    return {
      id: microchip.id,
      batch: microchip.batch,
      microchipCode: microchip.microchipCode,
      status: microchip.status,
      pet: microchip.pet,
      isDeleted: microchip.isDeleted,
      createdAt: microchip.createdAt,
      updatedAt: microchip.updatedAt,
      deletedAt: microchip.deletedAt,
    };
  }

  static toResponseList(items: MicrochipModel[]): MicrochipResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
