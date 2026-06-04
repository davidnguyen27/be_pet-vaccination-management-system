import { RoleCode } from '@/enums';
import { VaccinePlanStatus } from '@/enums/vaccine';
import { DataResponse } from '@/shared/application/response.dto';
import { Roles } from '@/shared/presentation/decorators';
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateVaccinePlanUseCase } from '../../application/use-cases/create-vaccine-plan.use-case';
import { DeleteVaccinePlanUseCase } from '../../application/use-cases/delete-vaccine-plan.use-case';
import { GetVaccinePlansUseCase } from '../../application/use-cases/get-vaccine-plans.use-case';
import { UpdateVaccinePlanUseCase } from '../../application/use-cases/update-vaccine-plan.use-case';
import { VaccinePlanDTO } from './dto/vaccine-plan-request.dto';
import { VaccinePlanQueryDto } from './dto/vaccine-plan.query.dto';
import { VaccinePlanHttpMapper } from './mapper/vaccine-plan.mapper';

const vaccinePlanSchema = {
  type: 'object',
  required: ['petId', 'vaccineId', 'doseNo', 'dueDate', 'status'],
  properties: {
    petId: { type: 'string' },
    vaccineId: { type: 'string' },
    doseNo: { type: 'integer', minimum: 1 },
    dueDate: { type: 'string', format: 'date' },
    dueFrom: { type: 'string', format: 'date', nullable: true },
    dueTo: { type: 'string', format: 'date', nullable: true },
    status: { type: 'string', enum: Object.values(VaccinePlanStatus) },
    vaccinationRecordId: { type: 'string', nullable: true },
    completedAt: { type: 'string', format: 'date-time', nullable: true },
    remindAt: { type: 'string', format: 'date-time', nullable: true },
    lastRemindedAt: { type: 'string', format: 'date-time', nullable: true },
    note: { type: 'string', nullable: true, maxLength: 255 },
  },
};

@Controller('vaccine-plan')
@ApiBearerAuth('access-token')
export class VaccinePlanController {
  constructor(
    private readonly getVaccinePlansUseCase: GetVaccinePlansUseCase,
    private readonly createVaccinePlanUseCase: CreateVaccinePlanUseCase,
    private readonly updateVaccinePlanUseCase: UpdateVaccinePlanUseCase,
    private readonly deleteVaccinePlanUseCase: DeleteVaccinePlanUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all vaccine plans' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'petId', required: false })
  @ApiQuery({ name: 'vaccineId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: VaccinePlanStatus })
  @ApiQuery({ name: 'dueFrom', required: false, type: String })
  @ApiQuery({ name: 'dueTo', required: false, type: String })
  async getVaccinePlans(@Query() query: VaccinePlanQueryDto) {
    const result = await this.getVaccinePlansUseCase.getMany(query);
    return DataResponse.paginate(VaccinePlanHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get vaccine plan by id' })
  async getVaccinePlanById(@Param('id', ParseUUIDPipe) id: string) {
    const vaccinePlan = await this.getVaccinePlansUseCase.getById(id);
    return DataResponse.of(VaccinePlanHttpMapper.toResponse(vaccinePlan));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new vaccine plan' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: vaccinePlanSchema })
  async createVaccinePlan(@Body() vaccinePlan: VaccinePlanDTO) {
    const created = await this.createVaccinePlanUseCase.execute(vaccinePlan);
    return DataResponse.of(VaccinePlanHttpMapper.toResponse(created));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a vaccine plan' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: vaccinePlanSchema })
  async updateVaccinePlan(@Param('id', ParseUUIDPipe) id: string, @Body() vaccinePlan: VaccinePlanDTO) {
    const updated = await this.updateVaccinePlanUseCase.execute({ ...vaccinePlan, id });
    return DataResponse.of(VaccinePlanHttpMapper.toResponse(updated));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vaccine plan' })
  @Roles(RoleCode.ADMIN)
  async deleteVaccinePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteVaccinePlanUseCase.execute(id);
  }
}
