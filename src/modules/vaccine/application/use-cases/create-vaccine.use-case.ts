import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { VaccineEntity } from '../../domain/vaccine.entity';
import { VaccineRepositoryPort } from '../ports/vaccine.repository.port';
import { VaccineModel } from '../model/vaccine.model';
import { VaccineQueryPort } from '../ports/vaccine.query.port';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';
import { VaccineStatus } from '@/enums/vaccine';

interface CreateVaccineCommand {
  speciesId: string;
  code: string;
  name: string;
  brand: string;
  description?: string | null;
  imgUrl?: Express.Multer.File;
  doseValue: number;
  doseUnit: string;
  status: VaccineStatus;
  defaultTotalDoses: number;
  defaultNextDueDays: number;
}

@Injectable()
export class CreateVaccineUseCase {
  constructor(
    private readonly vaccineRepo: VaccineRepositoryPort,
    private readonly vaccineQuery: VaccineQueryPort,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: CreateVaccineCommand): Promise<VaccineModel> {
    const existing = await this.vaccineRepo.findByCode(command.code);
    if (existing) throw new ConflictException('Vaccine already exists');

    const uploadedImage = command.imgUrl
      ? await this.cloudinaryService.upload(command.imgUrl, {
          folder: 'pet-vaccination/vaccines',
        })
      : null;

    const vaccine = VaccineEntity.create(randomUUID(), {
      speciesId: command.speciesId,
      code: command.code,
      name: command.name,
      brand: command.brand,
      description: command.description ?? null,
      imgUrl: uploadedImage?.secure_url ?? null,
      doseValue: command.doseValue,
      doseUnit: command.doseUnit,
      status: command.status,
      defaultTotalDoses: command.defaultTotalDoses,
      defaultNextDueDays: command.defaultNextDueDays,
    });

    await this.vaccineRepo.save(vaccine);

    return this.vaccineQuery.findById(vaccine.id);
  }
}
