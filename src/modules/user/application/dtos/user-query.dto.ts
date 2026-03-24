import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleCode } from '@/enums';
import { BaseQueryDto } from '@/shared/application/base-query.dto';
import { ActiveStatus } from '@/enums/user';

export class UserQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: RoleCode })
  @IsOptional()
  @IsEnum(RoleCode)
  roleCode?: RoleCode;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsEnum(ActiveStatus)
  isActive?: ActiveStatus;
}
