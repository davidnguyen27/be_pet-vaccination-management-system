import { BaseQueryDTO } from '@/shared/application/base-query.dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RoleCode } from '@/enums';

export class UserQueryDTO extends BaseQueryDTO {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(RoleCode)
  roleCode?: RoleCode;
}
