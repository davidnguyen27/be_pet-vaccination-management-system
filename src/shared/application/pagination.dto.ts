import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;
}

export class PaginationDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;

  constructor(data: T[], pageData: { total: number; page: number; limit: number }) {
    this.data = data;
    this.meta = {
      total: pageData.total,
      page: pageData.page,
      limit: pageData.limit,
      totalPages: Math.ceil(pageData.total / pageData.limit),
    };
  }
}
