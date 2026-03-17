import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetVetsUseCase } from '../application/use-cases/get-vets.use-case';
import { ResponseMessage } from '@/shared/decorators';
import { VetQueryDto } from '../application/dtos/vet-query.dto';
import { GetVetIdUseCase } from '../application/use-cases/get-vet-id.use-case';
import { UpdateVetUseCase } from '../application/use-cases/update-staff.use-case';
import { VetDto } from '../application/dtos/vet-req.dto';

@Controller('staffs')
@ApiBearerAuth('access-token')
export class VetController {
  constructor(
    private readonly getVetsUseCase: GetVetsUseCase,
    private readonly getVetByIdUseCase: GetVetIdUseCase,
    private readonly updateVetUseCase: UpdateVetUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all vets successfully.')
  @ApiOperation({ summary: 'Get all vets' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  getVets(@Query() query: VetQueryDto) {
    return this.getVetsUseCase.execute(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get vet by id successfully.')
  @ApiOperation({ summary: 'Get vet by id' })
  getVetById(@Query('id') id: string) {
    return this.getVetByIdUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update vet successfully.')
  @ApiOperation({ summary: 'Update vet' })
  updateVet(@Query('id') id: string, @Body() dto: VetDto) {
    return this.updateVetUseCase.execute(id, dto);
  }
}
