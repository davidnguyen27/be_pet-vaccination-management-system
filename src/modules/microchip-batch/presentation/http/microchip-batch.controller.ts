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
import { CreateMicrochipBatchUseCase } from '../../application/use-cases/create-microchip-batch.use-case';
import { DeleteMicrochipBatchUseCase } from '../../application/use-cases/delete-microchip-batch.use-case';
import { GetMicrochipBatchesUseCase } from '../../application/use-cases/get-microchip-batches.use-case';
import { UpdateMicrochipBatchUseCase } from '../../application/use-cases/update-microchip-batch.use-case';
import { MicrochipBatchQueryDto } from './dto/microchip-batch-query.dto';
import { MicrochipBatchDTO } from './dto/microchip-batch-request.dto';
import { MicrochipBatchHttpMapper } from './mapper/microchip-batch.mapper';

const microchipBatchSchema = {
  type: 'object',
  required: ['batchNo', 'vendorName', 'manufacturer', 'model', 'importDate', 'totalQuantity'],
  properties: {
    batchNo: { type: 'string', maxLength: 80 },
    vendorName: { type: 'string', maxLength: 150 },
    manufacturer: { type: 'string', maxLength: 150 },
    model: { type: 'string', maxLength: 100 },
    importDate: { type: 'string', format: 'date' },
    totalQuantity: { type: 'integer', minimum: 0 },
    notes: { type: 'string', nullable: true, maxLength: 255 },
  },
};

@Controller('microchip-batch')
@ApiBearerAuth('access-token')
export class MicrochipBatchController {
  constructor(
    private readonly getMicrochipBatchesUseCase: GetMicrochipBatchesUseCase,
    private readonly createMicrochipBatchUseCase: CreateMicrochipBatchUseCase,
    private readonly updateMicrochipBatchUseCase: UpdateMicrochipBatchUseCase,
    private readonly deleteMicrochipBatchUseCase: DeleteMicrochipBatchUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all microchip batches' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  async getMicrochipBatches(@Query() query: MicrochipBatchQueryDto) {
    const result = await this.getMicrochipBatchesUseCase.getMany(query);
    return DataResponse.paginate(MicrochipBatchHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get microchip batch by id' })
  async getMicrochipBatchById(@Param('id', ParseUUIDPipe) id: string) {
    const microchipBatch = await this.getMicrochipBatchesUseCase.getById(id);
    return DataResponse.of(MicrochipBatchHttpMapper.toResponse(microchipBatch));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new microchip batch' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: microchipBatchSchema })
  async createMicrochipBatch(@Body() microchipBatch: MicrochipBatchDTO) {
    const created = await this.createMicrochipBatchUseCase.execute(microchipBatch);
    return DataResponse.of(MicrochipBatchHttpMapper.toResponse(created));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a microchip batch' })
  @Roles(RoleCode.ADMIN)
  @ApiBody({ schema: microchipBatchSchema })
  async updateMicrochipBatch(@Param('id', ParseUUIDPipe) id: string, @Body() microchipBatch: MicrochipBatchDTO) {
    const updated = await this.updateMicrochipBatchUseCase.execute({ ...microchipBatch, id });
    return DataResponse.of(MicrochipBatchHttpMapper.toResponse(updated));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a microchip batch' })
  @Roles(RoleCode.ADMIN)
  async deleteMicrochipBatch(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteMicrochipBatchUseCase.execute(id);
  }
}
