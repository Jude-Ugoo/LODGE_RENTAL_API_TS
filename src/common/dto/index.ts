import { IsOptional, IsString } from "class-validator";

export class PaginationDTO {
  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

export class ApiResponseDto<T = any> {
  status: number;
  message: string;
  data: T;
}
