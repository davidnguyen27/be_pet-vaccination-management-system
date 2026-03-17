import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Query } from '@nestjs/common';
import { StaffQueryDto } from '../application/dtos/staff-query.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GetStaffsUseCase } from '../application/use-cases/get-staffs.use-case';
import { ResponseMessage } from '@/shared/decorators';
import { GetStaffIdUseCase } from '../application/use-cases/get-staff-id.use-case';
import { StaffDto } from '../application/dtos/staff-req.dto';
import { UpdateStaffUseCase } from '../application/use-cases/update-staff.use-case';

@Controller('staff')
@ApiBearerAuth('access-token')
export class StaffController {
  constructor(
    private readonly getStaffsUseCase: GetStaffsUseCase,
    private readonly getStaffByIdUseCase: GetStaffIdUseCase,
    private readonly updateStaffUseCase: UpdateStaffUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all staffs successfully.')
  @ApiOperation({ summary: 'Get all staffs' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  getStaff(@Query() query: StaffQueryDto) {
    return this.getStaffsUseCase.execute(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get staff by id successfully.')
  @ApiOperation({ summary: 'Get staff by id' })
  getStaffById(@Query('id') id: string) {
    return this.getStaffByIdUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update staff successfully.')
  @ApiOperation({ summary: 'Update staff' })
  updateStaff(@Query('id') id: string, @Body() dto: StaffDto) {
    return this.updateStaffUseCase.execute(id, dto);
  }
}
