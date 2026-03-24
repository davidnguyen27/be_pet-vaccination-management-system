import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetVetsUseCase } from '../application/use-cases/get-vets.use-case';
import { ResponseMessage } from '@/shared/decorators';
import { VetQueryDto } from '../application/dtos/vet-query.dto';
import { GetVetIdUseCase } from '../application/use-cases/get-vet-id.use-case';
import { UpdateVetUseCase } from '../application/use-cases/update-vet.use-case';
import { VetDto } from '../application/dtos/vet-req.dto';

@Controller('vet')
@ApiBearerAuth('access-token')
export class VetController {
  constructor(
    private readonly getVetsUseCase: GetVetsUseCase,
    private readonly getVetByIdUseCase: GetVetIdUseCase,
    private readonly updateVetUseCase: UpdateVetUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all vets' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  getVets(@Query() query: VetQueryDto) {
    return this.getVetsUseCase.execute(query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get vet by userId' })
  @HttpCode(HttpStatus.OK)
  getVetById(@Param('userId') userId: string) {
    return this.getVetByIdUseCase.execute(userId);
  }

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update vet successfully.')
  @ApiOperation({ summary: 'Update vet' })
  updateVet(@Param('userId') userId: string, @Body() dto: VetDto) {
    return this.updateVetUseCase.execute(userId, dto);
  }
}
