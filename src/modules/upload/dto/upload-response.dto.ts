import { IsArray, IsString } from 'class-validator';

export class UploadResponseDto {
  @IsArray()
  @IsString({ each: true })
  files: string[];
}
