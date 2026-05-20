import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleCode } from '@/enums';
import { JwtAuthGuard } from '@/shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/presentation/guards/roles.guard';
import { Roles } from '@/shared/presentation/decorators/roles.decorator';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { DataResponse } from '@/shared/application/response.dto';
import { UserHttpMapper } from './mapper/user.mapper';
import { UserQueryDTO } from './dto/user-query.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

const createUserFormDataSchema = {
  type: 'object',
  required: ['email', 'password', 'roleCode'],
  properties: {
    email: { type: 'string', example: 'user@gmail.com' },
    password: { type: 'string', example: 'Password@123' },
    roleCode: { type: 'string', enum: Object.values(RoleCode), example: RoleCode.STAFF },
    fullName: { type: 'string', example: 'Nguyen Van A' },
    phoneNumber: { type: 'string', example: '0123456789' },
    avatar: { type: 'string', format: 'binary' },
    dob: { type: 'string', format: 'date', example: '1989-01-01' },
  },
};

const updateUserFormDataSchema = {
  type: 'object',
  properties: {
    fullName: { type: 'string', example: 'Nguyen Van A' },
    phoneNumber: { type: 'string', example: '0123456789' },
    avatar: { type: 'string', format: 'binary' },
    dob: { type: 'string', format: 'date', example: '1989-01-01' },
  },
};

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  // Get all users
  @Get()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'roleCode', required: false, enum: RoleCode })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getUsers(@Query() query: UserQueryDTO) {
    const result = await this.getUserUseCase.getMany(query);
    return DataResponse.paginate(UserHttpMapper.toResponseList(result.items), result.meta);
  }

  // Create a user
  @Post()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: createUserFormDataSchema,
  })
  @UseInterceptors(FileInterceptor('avatar', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async createUser(@Body() dto: CreateUserDTO, @UploadedFile() avatar?: Express.Multer.File) {
    const user = await this.createUserUseCase.execute({ ...dto, avatar });
    return DataResponse.of(UserHttpMapper.toResponse(user));
  }

  // Get user by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by Id' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.getUserUseCase.getById(id);
    return DataResponse.of(UserHttpMapper.toResponse(user));
  }

  // Update a user
  @Patch(':id')
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: updateUserFormDataSchema,
  })
  @UseInterceptors(FileInterceptor('avatar', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDTO,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const user = await this.updateUserUseCase.execute({ id, ...dto, avatar });
    return DataResponse.of(UserHttpMapper.toResponse(user));
  }

  // Delete a user
  @Delete(':id')
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
