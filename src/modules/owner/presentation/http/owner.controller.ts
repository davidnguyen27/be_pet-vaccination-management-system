import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleCode } from '@/enums';
import { Roles, ResponseMessage } from '@/shared/presentation/decorators';
import { GetOwnersUseCase } from '../../application/use-cases/get-owners.use-cases';
import { UpdateOwnerUseCase } from '../../application/use-cases/update-owner.use-case';
import { OwnerQueryDTO } from './dto/owner-query.dto';
import { OwnerDTO } from './dto/owner-request.dto';
import { DataResponse } from '@/shared/application/response.dto';
import { OwnerHttpMapper } from './mapper/owner.mapper';

@Controller('owners')
@ApiBearerAuth('access-token')
export class OwnerController {
  constructor(
    private readonly getOwnersUseCase: GetOwnersUseCase,
    private readonly updateOwnerUseCase: UpdateOwnerUseCase,
  ) {}

  @Get()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all owners' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getOwners(@Query() query: OwnerQueryDTO) {
    const result = await this.getOwnersUseCase.getMany(query);
    return DataResponse.paginate(OwnerHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':userId')
  @Roles(RoleCode.ADMIN, RoleCode.OWN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get owner by userId' })
  async getOwnerByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    const owner = await this.getOwnersUseCase.getById(userId);
    return DataResponse.of(OwnerHttpMapper.toResponse(owner));
  }

  @Put(':userId')
  @Roles(RoleCode.ADMIN, RoleCode.OWN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update successfully.')
  @ApiOperation({ summary: 'Update owner by userId' })
  async updateOwner(@Param('userId', ParseUUIDPipe) userId: string, @Body() dto: OwnerDTO) {
    await this.updateOwnerUseCase.execute({ ...dto, id: userId });
    const owner = await this.getOwnersUseCase.getById(userId);
    return DataResponse.of(OwnerHttpMapper.toResponse(owner));
  }
}
