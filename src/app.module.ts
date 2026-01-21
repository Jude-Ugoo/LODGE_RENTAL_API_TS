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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config, emailConfig],
      validate,
    }),
    EmailProviderModule.forRootAsync(),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
