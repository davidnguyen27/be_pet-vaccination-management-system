import { RoleCode } from '@/enums';
import { MicrochipStatus } from '@/enums/microchip';
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
import { CreateMicrochipUseCase } from '../../application/use-cases/create-microchip.use-case';
import { DeleteMicrochipUseCase } from '../../application/use-cases/delete-microchip.use-case';
import { GetMicrochipsUseCase } from '../../application/use-cases/get-microchips.use-case';
import { UpdateMicrochipUseCase } from '../../application/use-cases/update-microchip.use-case';
import { MicrochipQueryDto } from './dto/microchip-query.dto';
import { MicrochipDTO } from './dto/microchip-request.dto';
import { MicrochipHttpMapper } from './mapper/microchip.mapper';

const microchipSchema = {
  type: 'object',
  required: ['batchId', 'microchipCode', 'status'],
  properties: {
    batchId: { type: 'string' },
    microchipCode: { type: 'string', maxLength: 50 },
    status: { type: 'string', enum: Object.values(MicrochipStatus) },
    petId: { type: 'string', nullable: true },
  },
};

@Controller('microchip')
@ApiBearerAuth('access-token')
export class MicrochipController {
  constructor(
    private readonly getMicrochipsUseCase: GetMicrochipsUseCase,
    private readonly createMicrochipUseCase: CreateMicrochipUseCase,
    private readonly updateMicrochipUseCase: UpdateMicrochipUseCase,
    private readonly deleteMicrochipUseCase: DeleteMicrochipUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all microchips' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'batchId', required: false })
  @ApiQuery({ name: 'petId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: MicrochipStatus })
  async getMicrochips(@Query() query: MicrochipQueryDto) {
    const result = await this.getMicrochipsUseCase.getMany(query);
    return DataResponse.paginate(MicrochipHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get microchip by id' })
  async getMicrochipById(@Param('id', ParseUUIDPipe) id: string) {
    const microchip = await this.getMicrochipsUseCase.getById(id);
    return DataResponse.of(MicrochipHttpMapper.toResponse(microchip));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new microchip' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: microchipSchema })
  async createMicrochip(@Body() microchip: MicrochipDTO) {
    const created = await this.createMicrochipUseCase.execute(microchip);
    return DataResponse.of(MicrochipHttpMapper.toResponse(created));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a microchip' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: microchipSchema })
  async updateMicrochip(@Param('id', ParseUUIDPipe) id: string, @Body() microchip: MicrochipDTO) {
    const updated = await this.updateMicrochipUseCase.execute({ ...microchip, id });
    return DataResponse.of(MicrochipHttpMapper.toResponse(updated));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a microchip' })
  @Roles(RoleCode.ADMIN)
  async deleteMicrochip(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteMicrochipUseCase.execute(id);
  }
}
