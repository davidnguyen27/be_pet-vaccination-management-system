import { ConflictException, Injectable } from '@nestjs/common';
import { VaccineRepositoryPort } from '../ports/vaccine.repository.port';
import { VaccineDTO } from '../../presentation/http/dto/vaccine-request.dto';
import { VaccineModel } from '../model/vaccine.model';
import { VaccineQueryPort } from '../ports/vaccine.query.port';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class UpdateVaccineUseCase {
  constructor(
    private readonly vaccineRepo: VaccineRepositoryPort,
    private readonly vaccineQuery: VaccineQueryPort,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: VaccineDTO & { id: string }): Promise<VaccineModel> {
    const vaccine = await this.vaccineRepo.findByIdOrThrow(command.id);

    if (command.code !== undefined && command.code !== vaccine.code) {
      const existingCode = await this.vaccineRepo.findByCode(command.code);
      if (existingCode && existingCode.id !== command.id) {
        throw new ConflictException('Vaccine code already exists');
      }
    }

    const uploadedImage = command.imgUrl
      ? await this.cloudinaryService.upload(command.imgUrl, {
          folder: 'pet-vaccination/vaccines',
        })
      : null;

    try {
      vaccine.update({
        speciesId: command.speciesId,
        code: command.code,
        name: command.name,
        brand: command.brand,
        description: command.description,
        imgUrl: uploadedImage?.secure_url ?? vaccine.imgUrl,
        doseValue: command.doseValue,
        doseUnit: command.doseUnit,
        status: command.status,
        defaultTotalDoses: command.defaultTotalDoses,
        defaultNextDueDays: command.defaultNextDueDays,
      });

      await this.vaccineRepo.save(vaccine);
    } catch (error) {
      if (uploadedImage?.public_id) {
        await this.cloudinaryService.delete(uploadedImage.public_id);
      }

      throw error;
    }

    return this.vaccineQuery.findById(vaccine.id);
  }
}
