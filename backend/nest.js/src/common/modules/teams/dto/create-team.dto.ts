import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  productOwnerId?: number;

  @IsInt()
  @IsOptional()
  projectManagerId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  userIds?: number[];

  @IsInt()
  @IsOptional()
  projectId?: number;
}
