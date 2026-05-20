import { RoleCode } from '@/enums';
import { VaccineLotStatus } from '@/enums/vaccine';
import { DataResponse } from '@/shared/application/response.dto';
import { Roles } from '@/shared/presentation/decorators';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateVaccineLotUseCase } from '../../application/use-cases/create-vaccine-lot.use-case';
import { DeleteVaccineLotUseCase } from '../../application/use-cases/delete-vaccine-lot.use-case';
import { GetVaccineLotsUseCase } from '../../application/use-cases/get-vaccine-lots.use-case';
import { UpdateVaccineLotUseCase } from '../../application/use-cases/update-vaccine-lot.use-case';
import { VaccineLotDTO } from './dto/vaccine-lot-request.dto';
import { VaccineLotQueryDto } from './dto/vaccine-lot.query.dto';
import { VaccineLotHttpMapper } from './mapper/vaccine-lot.mapper';

const vaccineLotSchema = {
  type: 'object',
  required: [
    'vaccineId',
    'lotNo',
    'mfgDate',
    'expDate',
    'initialQuantity',
    'quantityOnHand',
    'storageTempMin',
    'storageTempMax',
    'status',
  ],
  properties: {
    vaccineId: { type: 'string' },
    lotNo: { type: 'string' },
    mfgDate: { type: 'string', format: 'date' },
    expDate: { type: 'string', format: 'date' },
    initialQuantity: { type: 'integer', minimum: 1 },
    quantityOnHand: { type: 'integer', minimum: 0 },
    storageTempMin: { type: 'number' },
    storageTempMax: { type: 'number' },
    status: { type: 'string', enum: Object.values(VaccineLotStatus) },
  },
};

@Controller('vaccine-lot')
@ApiBearerAuth('access-token')
export class VaccineLotController {
  constructor(
    private readonly getVaccineLotsUseCase: GetVaccineLotsUseCase,
    private readonly createVaccineLotUseCase: CreateVaccineLotUseCase,
    private readonly updateVaccineLotUseCase: UpdateVaccineLotUseCase,
    private readonly deleteVaccineLotUseCase: DeleteVaccineLotUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all vaccine lots' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'vaccineId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: VaccineLotStatus })
  async getVaccineLots(@Query() query: VaccineLotQueryDto) {
    const result = await this.getVaccineLotsUseCase.getMany(query);
    return DataResponse.paginate(VaccineLotHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get vaccine lot by id' })
  async getVaccineLotById(@Param('id') id: string) {
    const vaccineLot = await this.getVaccineLotsUseCase.getById(id);
    return DataResponse.of(VaccineLotHttpMapper.toResponse(vaccineLot));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new vaccine lot' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: vaccineLotSchema })
  async createVaccineLot(@Body() vaccineLot: VaccineLotDTO) {
    const created = await this.createVaccineLotUseCase.execute(vaccineLot);
    return DataResponse.of(VaccineLotHttpMapper.toResponse(created));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a vaccine lot' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: vaccineLotSchema })
  async updateVaccineLot(@Param('id') id: string, @Body() vaccineLot: VaccineLotDTO) {
    const updated = await this.updateVaccineLotUseCase.execute({ ...vaccineLot, id });
    return DataResponse.of(VaccineLotHttpMapper.toResponse(updated));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vaccine lot' })
  @Roles(RoleCode.ADMIN)
  async deleteVaccineLot(@Param('id') id: string) {
    return this.deleteVaccineLotUseCase.execute(id);
  }
}
