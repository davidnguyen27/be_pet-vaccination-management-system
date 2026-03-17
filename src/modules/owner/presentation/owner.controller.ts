import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
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
  @ResponseMessage('Get all owners successfully.')
  @ApiOperation({ summary: 'Get all owners' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  getOwners(@Query() query: OwnerQueryDto) {
    return this.getOwnersUseCase.execute(query);
  }

  @Get(':id')
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get owner by id successfully.')
  @ApiOperation({ summary: 'Get owner by id' })
  getOwnerById(@Param('id') id: string) {
    return this.getOwnerByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update owner successfully.')
  @ApiOperation({ summary: 'Update owner' })
  updateOwner(@Param('id') ownerId: string, @Body() dto: OwnerDto) {
    return this.updateOwnerUseCase.execute(ownerId, dto);
  }
}
