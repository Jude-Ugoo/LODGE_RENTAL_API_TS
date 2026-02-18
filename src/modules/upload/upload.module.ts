import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadProviderModule } from 'src/common/modules/uploadProvider/uploadProvider.module';

@Module({
  imports: [UploadProviderModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
