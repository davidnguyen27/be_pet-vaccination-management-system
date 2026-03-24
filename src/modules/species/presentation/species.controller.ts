import { Public, ResponseMessage } from '@/shared/decorators';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SpeciesQueryDto } from '../application/dtos/species-query.dto';
import { GetSpeciesUseCase } from '../application/use-cases/get-species.use-case';
import { GetSpeciesIdUseCase } from '../application/use-cases/get-species-id.use-case';

@Public()
@Controller('species')
export class SpeciesController {
  constructor(
    private readonly getSpeciesUseCase: GetSpeciesUseCase,
    private readonly getSpeciesIdUseCase: GetSpeciesIdUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({ summary: 'Get all species' })
  @ResponseMessage('Get all species successfully.')
  getSpecies(@Query() query: SpeciesQueryDto) {
    return this.getSpeciesUseCase.execute(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get species by id' })
  @ResponseMessage('Get species by id successfully.')
  getSpeciesId(@Query('id') id: string) {
    return this.getSpeciesIdUseCase.execute(id);
  }
}
