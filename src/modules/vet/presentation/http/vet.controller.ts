import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleCode } from '@/enums';
import { DataResponse } from '@/shared/application/response.dto';
import { Roles } from '@/shared/presentation/decorators';
import { GetVetsUseCase } from '../../application/use-cases/get-vets.use-case';
import { UpdateVetUseCase } from '../../application/use-cases/update-vet.use-case';
import { VetDTO } from './dto/vet-request.dto';
import { VetQueryDTO } from './dto/vet-query.dto';
import { VetHttpMapper } from './mapper/vet.mapper';

@Controller('vet')
@ApiBearerAuth('access-token')
export class VetController {
  constructor(
    private readonly getVetsUseCase: GetVetsUseCase,
    private readonly updateVetUseCase: UpdateVetUseCase,
  ) {}

  @Get()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all vets' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getVets(@Query() query: VetQueryDTO) {
    const result = await this.getVetsUseCase.getMany(query);
    return DataResponse.paginate(VetHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':userId')
  @Roles(RoleCode.ADMIN, RoleCode.VET)
  @ApiOperation({ summary: 'Get vet by userId' })
  @HttpCode(HttpStatus.OK)
  async getVetById(@Param('userId') userId: string) {
    const vet = await this.getVetsUseCase.getByUserId(userId);
    return DataResponse.of(VetHttpMapper.toResponse(vet));
  }

  @Patch(':userId')
  @Roles(RoleCode.ADMIN, RoleCode.VET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update vet' })
  async updateVet(@Param('userId') userId: string, @Body() dto: VetDTO) {
    await this.updateVetUseCase.execute({ ...dto, userId });
    const vet = await this.getVetsUseCase.getByUserId(userId);
    return DataResponse.of(VetHttpMapper.toResponse(vet));
  }
}
