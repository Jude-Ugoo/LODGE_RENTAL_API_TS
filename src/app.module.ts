import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import config from 'src/config/dbConfig/config';

import { validate } from './common/validations/environment.validations';
import { EmailProviderModule } from './common/modules/emailProvider/emailProvider.module';
import emailConfig from './common/configs/email.config';
import uploadConfig from './common/configs/upload.config';
import { UploadProviderModule } from './common/modules/uploadProvider/uploadProvider.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config, emailConfig, uploadConfig],
      validate,
    }),
    EmailProviderModule.forRootAsync(),
    UploadProviderModule.forRootAsync(),
    UserModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
