import { Inject, Injectable } from '@nestjs/common';
import { VetQueryDto } from '../dtos/vet-query.dto';
import { PaginationDto } from '@/shared/application/pagination.dto';
import { VetResponseDto } from '../dtos/vet-res.dto';
import { VetMapper } from '../../infrastructure/vet.mapper';
import { I_VET_REPOSITORY, IVetRepository } from '../../domain/i-vet.repository';

@Injectable()
export class GetVetsUseCase {
  constructor(@Inject(I_VET_REPOSITORY) private readonly vetRepo: IVetRepository) {}

  async execute(query: VetQueryDto): Promise<PaginationDto<VetResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.vetRepo.findAll({
      page,
      limit,
      search: query.search,
    });

    const vets = result.data.map(vet => VetMapper.toResponse(vet));

    return new PaginationDto(vets, { total: result.total, page, limit });
  }
}
