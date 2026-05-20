import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetVaccinesUseCase } from '../../application/use-cases/get-vaccines.use-case';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VaccineQueryDto } from './dto/vaccine-query.dto';
import { CreateVaccineUseCase } from '../../application/use-cases/create-vaccine.use-case';
import { Roles } from '@/shared/presentation/decorators';
import { RoleCode } from '@/enums';
import { VaccineDTO } from './dto/vaccine-request.dto';
import { DeleteVaccineUseCase } from '../../application/use-cases/delete-vaccine.use-case';
import { UpdateVaccineUseCase } from '../../application/use-cases/update-vaccine.use-case';
import { DataResponse } from '@/shared/application/response.dto';
import { VaccineHttpMapper } from './mapper/vaccine.mapper';
import { VaccineStatus } from '@/enums/vaccine';
import { FileInterceptor } from '@nestjs/platform-express';

const createVaccineSchema = {
  type: 'object',
  required: [
    'speciesId',
    'code',
    'name',
    'brand',
    'doseValue',
    'doseUnit',
    'status',
    'defaultTotalDoses',
    'defaultNextDueDays',
  ],
  properties: {
    speciesId: { type: 'string' },
    code: { type: 'string' },
    name: { type: 'string' },
    brand: { type: 'string' },
    description: { type: 'string', nullable: true },
    imgUrl: { type: 'string', format: 'binary', nullable: true },
    doseValue: { type: 'number', minimum: 0.01 },
    doseUnit: { type: 'string' },
    status: { type: 'string', enum: Object.values(VaccineStatus) },
    defaultTotalDoses: { type: 'number', minimum: 1 },
    defaultNextDueDays: { type: 'number', minimum: 0 },
  },
};

@Controller('vaccine')
@ApiBearerAuth('access-token')
export class VaccineController {
  constructor(
    private readonly getVaccinesUseCase: GetVaccinesUseCase,
    private readonly createVaccineUseCase: CreateVaccineUseCase,
    private readonly updateVaccineUseCase: UpdateVaccineUseCase,
    private readonly deleteVaccineUseCase: DeleteVaccineUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all vaccines' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'species',
    required: false,
  })
  async getVaccines(@Query() query: VaccineQueryDto) {
    const result = await this.getVaccinesUseCase.getMany(query);
    return DataResponse.paginate(VaccineHttpMapper.toResponseList(result.items), result.meta);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get vaccine by id' })
  async getVaccineById(@Param('id') id: string) {
    const vaccine = await this.getVaccinesUseCase.getById(id);
    return DataResponse.of(VaccineHttpMapper.toResponse(vaccine));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new vaccine' })
  @Roles(RoleCode.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: createVaccineSchema,
  })
  @UseInterceptors(FileInterceptor('imgUrl', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async createVaccine(@Body() vaccine: VaccineDTO, @UploadedFile() imgUrl?: Express.Multer.File) {
    const created = await this.createVaccineUseCase.execute({ ...vaccine, imgUrl });
    return DataResponse.of(VaccineHttpMapper.toResponse(created));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a vaccine' })
  @Roles(RoleCode.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: createVaccineSchema,
  })
  @UseInterceptors(FileInterceptor('imgUrl', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async updateVaccine(
    @Param('id') id: string,
    @Body() vaccine: VaccineDTO,
    @UploadedFile() imgUrl?: Express.Multer.File,
  ) {
    const updated = await this.updateVaccineUseCase.execute({ ...vaccine, id, imgUrl });
    return DataResponse.of(VaccineHttpMapper.toResponse(updated));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a vaccine' })
  @Roles(RoleCode.ADMIN)
  async deleteVaccine(@Param('id') id: string) {
    return this.deleteVaccineUseCase.execute(id);
  }
}
