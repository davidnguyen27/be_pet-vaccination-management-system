import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleCode } from '@/enums';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '../application/use-cases/get-users.use-case';
import { UserDto } from '../application/dtos/user-req.dto';
import { UserQueryDto } from '../application/dtos/user-query.dto';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ResponseMessage } from '@/shared/decorators';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all users successfully.')
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'roleCode', required: false, enum: RoleCode })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  getUsers(@Query() query: UserQueryDto) {
    return this.getAllUsersUseCase.execute(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by Id' })
  getUserById(@Param('id') userId: string) {
    return this.getUserByIdUseCase.execute(userId);
  }

  @Post()
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User created successfully.')
  @ApiOperation({ summary: 'Create a new user' })
  createUser(@Body() dto: UserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Patch(':id')
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User updated successfully.')
  @ApiOperation({ summary: 'Update a user' })
  updateUser(@Param('id') userId: string, @Body() dto: UserDto) {
    return this.updateUserUseCase.execute(userId, dto);
  }

  @Delete(':id')
  @Roles(RoleCode.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Delete user successfully.')
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(@Param('id') userId: string) {
    return this.deleteUserUseCase.execute(userId);
  }
}
