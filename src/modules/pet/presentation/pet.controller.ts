import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ResponseMessage } from '@/shared/decorators';
import { GetAllPetsUseCase } from '../application/use-cases/get-pets.use-case';
import { PetQueryDto } from '../application/dtos/pet-query.dto';
import { GetPetIdUseCase } from '../application/use-cases/get-pet-id.use-case';
import { CreatePetUseCase } from '../application/use-cases/create-pet.use-case';
import { PetDto } from '../application/dtos/pet-req.dto';
import { UpdatePetUseCase } from '../application/use-cases/update-pet.use-case';
import { DeletePetUseCase } from '../application/use-cases/delete-pet.use-case';

@Controller('pets')
@ApiBearerAuth('access-token')
export class PetController {
  constructor(
    private readonly getAllPetsUseCase: GetAllPetsUseCase,
    private readonly getPetIdUseCase: GetPetIdUseCase,
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all pets successfully.')
  @ApiOperation({ summary: 'Get all pets' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  getPets(@Query() query: PetQueryDto) {
    return this.getAllPetsUseCase.execute(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get pet by ID successfully.')
  @ApiOperation({ summary: 'Get pet by id' })
  getPetById(@Param('id') id: string) {
    return this.getPetIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Create pet successfully.')
  @ApiOperation({ summary: 'Create pet' })
  createPet(@Body() dto: PetDto) {
    return this.createPetUseCase.execute(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update pet successfully.')
  @ApiOperation({ summary: 'Update pet' })
  updatePet(@Param('id') id: string, @Body() dto: PetDto) {
    return this.updatePetUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Delete pet successfully.')
  @ApiOperation({ summary: 'Delete pet' })
  deletePet(@Param('id') id: string) {
    return this.deletePetUseCase.execute(id);
  }
}
