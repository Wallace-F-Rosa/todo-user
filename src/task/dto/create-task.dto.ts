import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
