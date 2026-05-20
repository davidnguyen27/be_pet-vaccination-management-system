import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from '@/shared/presentation/decorators';
import { RoleCode } from '@/enums';
import { GetStaffsUseCase } from '../../application/use-cases/get-staffs.use-case';
import { UpdateStaffUseCase } from '../../application/use-cases/update-staff.use-case';
import { StaffQueryDTO } from './dto/staff-query.dto';
import { StaffDTO } from './dto/staff-request.dto';
import { DataResponse } from '@/shared/application/response.dto';
import { StaffHttpMapper } from './mapper/staff.mapper';

@Controller('staff')
@ApiBearerAuth('access-token')
export class StaffController {
  constructor(
    private readonly getStaffsUseCase: GetStaffsUseCase,
    private readonly updateStaffUseCase: UpdateStaffUseCase,
  ) {}

  @Get()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all staffs' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getStaff(@Query() query: StaffQueryDTO) {
    const result = await this.getStaffsUseCase.getMany(query);
    return DataResponse.paginate(StaffHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':userId')
  @Roles(RoleCode.STAFF, RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get staff by id' })
  async getStaffById(@Param('userId') userId: string) {
    const staff = await this.getStaffsUseCase.getById(userId);
    return DataResponse.of(StaffHttpMapper.toResponse(staff));
  }

  @Put(':userId')
  @Roles(RoleCode.STAFF, RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update staff by id' })
  async updateStaff(@Param('userId') userId: string, @Body() dto: StaffDTO) {
    await this.updateStaffUseCase.execute({ ...dto, id: userId });
    const staff = await this.getStaffsUseCase.getById(userId);
    return DataResponse.of(StaffHttpMapper.toResponse(staff));
  }
}
