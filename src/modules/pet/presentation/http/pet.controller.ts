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
import { DataResponse } from '@/shared/application/response.dto';
import { CreatePetUseCase } from '../../application/use-cases/create-pet.use-case';
import { DeletePetUseCase } from '../../application/use-cases/delete-pet.use-case';
import { GetPetsUseCase } from '../../application/use-cases/get-pets.use-case';
import { UpdatePetUseCase } from '../../application/use-cases/update-pet.use-case';
import { PetQueryDTO } from './dto/pet-query.dto';
import { PetDTO } from './dto/pet-request.dto';
import { PetHttpMapper } from './mapper/pet.mapper';

@Controller('pets')
@ApiBearerAuth('access-token')
export class PetController {
  constructor(
    private readonly getPetsUseCase: GetPetsUseCase,
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all pets' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getPets(@Query() query: PetQueryDTO) {
    const result = await this.getPetsUseCase.getMany(query);
    return DataResponse.paginate(PetHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get pet by id' })
  async getPetById(@Param('id', ParseUUIDPipe) id: string) {
    const pet = await this.getPetsUseCase.getById(id);
    return DataResponse.of(PetHttpMapper.toResponse(pet));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create pet' })
  async createPet(@Body() dto: PetDTO) {
    const pet = await this.createPetUseCase.execute(dto);
    return DataResponse.of(PetHttpMapper.toResponse(pet));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update pet' })
  async updatePet(@Param('id', ParseUUIDPipe) id: string, @Body() dto: PetDTO) {
    const pet = await this.updatePetUseCase.execute(id, dto);
    return DataResponse.of(PetHttpMapper.toResponse(pet));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete pet' })
  async deletePet(@Param('id', ParseUUIDPipe) id: string) {
    return this.deletePetUseCase.execute(id);
  }
}
