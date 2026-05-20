import { DataResponse } from '@/shared/application/response.dto';
import { Public, Roles } from '@/shared/presentation/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateSpeciesUseCase } from '../../application/use-cases/create-species.use-case';
import { DeleteSpeciesUseCase } from '../../application/use-cases/delete-species.use-case';
import { GetSpeciesUseCase } from '../../application/use-cases/get-species.use-case';
import { UpdateSpeciesUseCase } from '../../application/use-cases/update-species.use-case';
import { SpeciesQueryDTO } from './dto/query.dto';
import { SpeciesHttpMapper } from './mapper/species.mapper';
import { SpeciesDTO } from './dto/species-request.dto';
import { RoleCode } from '@/enums';

@Controller('species')
@ApiBearerAuth('access-token')
export class SpeciesController {
  constructor(
    private readonly getSpeciesUseCase: GetSpeciesUseCase,
    private readonly createSpeciesUseCase: CreateSpeciesUseCase,
    private readonly updateSpeciesUseCase: UpdateSpeciesUseCase,
    private readonly deleteSpeciesUseCase: DeleteSpeciesUseCase,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({ summary: 'Get all species' })
  async getSpecies(@Query() query: SpeciesQueryDTO) {
    const result = await this.getSpeciesUseCase.getMany(query);
    return DataResponse.paginate(SpeciesHttpMapper.toResponseList(result.items), result.meta);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get species by id' })
  async getSpeciesId(@Param('id', ParseUUIDPipe) id: string) {
    const species = await this.getSpeciesUseCase.getById(id);
    return DataResponse.of(SpeciesHttpMapper.toResponse(species));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create species' })
  @Roles(RoleCode.ADMIN)
  async createSpecies(@Body() dto: SpeciesDTO) {
    const species = await this.createSpeciesUseCase.execute(dto);
    return DataResponse.of(SpeciesHttpMapper.toResponse(species));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update species' })
  @Roles(RoleCode.ADMIN)
  async updateSpecies(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SpeciesDTO) {
    const species = await this.updateSpeciesUseCase.execute({ id, ...dto });
    return DataResponse.of(SpeciesHttpMapper.toResponse(species));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete species' })
  @Roles(RoleCode.ADMIN)
  deleteSpecies(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteSpeciesUseCase.execute(id);
  }
}
