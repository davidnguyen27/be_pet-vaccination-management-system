import { RoleCode } from '@/enums';
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
import { CreateWorkingShiftUseCase } from '../../application/use-cases/create-working-shift.use-case';
import { DeleteWorkingShiftUseCase } from '../../application/use-cases/delete-working-shift.use-case';
import { GetWorkingShiftsUseCase } from '../../application/use-cases/get-working-shifts.use-case';
import { UpdateWorkingShiftUseCase } from '../../application/use-cases/update-working-shift.use-case';
import { Weekday } from '../../domain/working-shift.types';
import { WorkingShiftQueryDto } from './dto/working-shift-query.dto';
import { WorkingShiftRequestDTO } from './dto/working-shift-request.dto';
import { WorkingShiftHttpMapper } from './mapper/working-shift.mapper';

const workingShiftSchema = {
  type: 'object',
  required: ['vetId', 'dayOfWeek', 'startTime', 'endTime', 'slotDuration', 'maxAppointments'],
  properties: {
    vetId: { type: 'string', format: 'uuid' },
    dayOfWeek: { type: 'string', enum: Object.values(Weekday) },
    startTime: { type: 'string', format: 'date-time', example: '1970-01-01T08:00:00.000Z' },
    endTime: { type: 'string', format: 'date-time', example: '1970-01-01T17:00:00.000Z' },
    slotDuration: { type: 'integer', minimum: 1, default: 30 },
    maxAppointments: { type: 'integer', minimum: 1, default: 1 },
    notes: { type: 'string', nullable: true, maxLength: 255 },
  },
};

@Controller('working-shift')
@ApiBearerAuth('access-token')
export class WorkingShiftController {
  constructor(
    private readonly getWorkingShiftsUseCase: GetWorkingShiftsUseCase,
    private readonly createWorkingShiftUseCase: CreateWorkingShiftUseCase,
    private readonly updateWorkingShiftUseCase: UpdateWorkingShiftUseCase,
    private readonly deleteWorkingShiftUseCase: DeleteWorkingShiftUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all working shifts' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'vetId', required: false })
  @ApiQuery({ name: 'dayOfWeek', required: false, enum: Weekday })
  async getWorkingShifts(@Query() query: WorkingShiftQueryDto) {
    const result = await this.getWorkingShiftsUseCase.getMany(query);
    return DataResponse.paginate(WorkingShiftHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get working shift by id' })
  async getWorkingShiftById(@Param('id', ParseUUIDPipe) id: string) {
    const workingShift = await this.getWorkingShiftsUseCase.getById(id);
    return DataResponse.of(WorkingShiftHttpMapper.toResponse(workingShift));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new working shift' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: workingShiftSchema })
  async createWorkingShift(@Body() workingShift: WorkingShiftRequestDTO) {
    const created = await this.createWorkingShiftUseCase.execute(workingShift);
    return DataResponse.of(WorkingShiftHttpMapper.toResponse(created));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a working shift' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: workingShiftSchema })
  async updateWorkingShift(@Param('id', ParseUUIDPipe) id: string, @Body() workingShift: WorkingShiftRequestDTO) {
    const updated = await this.updateWorkingShiftUseCase.execute({ ...workingShift, id });
    return DataResponse.of(WorkingShiftHttpMapper.toResponse(updated));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a working shift' })
  @Roles(RoleCode.ADMIN)
  async deleteWorkingShift(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteWorkingShiftUseCase.execute(id);
  }
}
