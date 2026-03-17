import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ResponseMessage } from '@/shared/decorators';
import { GetAllPetsUseCase } from '../application/use-cases/get-pets.use-case';
import { PetQueryDto } from '../application/dtos/pet-query.dto';

@Controller('pets')
@ApiBearerAuth('access-token')
export class PetController {
  constructor(private readonly getAllPetsUseCase: GetAllPetsUseCase) {}

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
}
