import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleCode } from '@/enums';
import { Roles, ResponseMessage } from '@/shared/decorators';
import { GetOwnersUseCase } from '../application/use-cases/get-owners.use-cases';
import { OwnerQueryDto } from '../application/dtos/owner-query.dto';
import { GetOwnerByIdUseCase } from '../application/use-cases/get-owner-id.use-case';
import { OwnerDto } from '../application/dtos/owner-req.dto';
import { UpdateOwnerUseCase } from '../application/use-cases/update-owner.use-case';

@Controller('owners')
@ApiBearerAuth('access-token')
export class OwnerController {
  constructor(
    private readonly getOwnersUseCase: GetOwnersUseCase,
    private readonly getOwnerByIdUseCase: GetOwnerByIdUseCase,
    private readonly updateOwnerUseCase: UpdateOwnerUseCase,
  ) {}

  @Get()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all owners' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  getOwners(@Query() query: OwnerQueryDto) {
    return this.getOwnersUseCase.execute(query);
  }

  @Get(':userId')
  @Roles(RoleCode.ADMIN, RoleCode.OWN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get owner by userId' })
  getOwnerByUserId(@Param('userId') userId: string) {
    return this.getOwnerByIdUseCase.execute(userId);
  }

  @Put(':userId')
  @Roles(RoleCode.ADMIN, RoleCode.OWN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update successfully.')
  @ApiOperation({ summary: 'Update owner by userId' })
  updateOwner(@Param('userId') userId: string, @Body() dto: OwnerDto) {
    return this.updateOwnerUseCase.execute(userId, dto);
  }
}
