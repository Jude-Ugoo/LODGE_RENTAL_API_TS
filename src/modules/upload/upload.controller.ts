import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import fileInterceptorOptions from './helpers/filesInterceptor';
import { FileValidationPipe } from './pipes';
import { UploadService } from './upload.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto';
import type { File } from 'multer';
import { UploadResponseDto } from './dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, fileInterceptorOptions))
  @ApiOperation({ summary: 'Upload files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 10)',
        },
      },
      required: ['files'],
    },
  })
  @ApiCreatedResponse({
    description: 'Process successful',
    type: ApiResponseDto<UploadResponseDto>,
  })
  @ApiBadRequestResponse({
    description: 'Invalid files or upload failed',
  })
  async uploadFiles(
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ApiResponseDto<UploadResponseDto>> {
    const uploadedFiles = await this.uploadService.upload(files);
    return {
      status: 201,
      message: 'Files uploaded successfully',
      data: {
        files: uploadedFiles,
      },
    };
  }
}
