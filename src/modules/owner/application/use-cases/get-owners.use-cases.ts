import { Inject, Injectable } from '@nestjs/common';
import { I_OWNER_REPOSITORY, IOwnerRepository } from '../../domain/i-owner.repository';
import { OwnerQueryDto } from '../dtos/owner-query.dto';
import { PaginationDto } from '@/shared/application/pagination.dto';
import { OwnerResponseDto } from '../dtos/owner-res.dto';
import { OwnerMapper } from '../../infrastructure/owner.mapper';

@Injectable()
export class GetOwnersUseCase {
  constructor(@Inject(I_OWNER_REPOSITORY) private readonly ownerRepo: IOwnerRepository) {}

  async execute(query: OwnerQueryDto): Promise<PaginationDto<OwnerResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.ownerRepo.findAll({
      page,
      limit,
      search: query.search,
    });

    const owners = result.data.map(owner => OwnerMapper.toResponse(owner));

    return new PaginationDto(owners, { total: result.total, page, limit });
  }
}
