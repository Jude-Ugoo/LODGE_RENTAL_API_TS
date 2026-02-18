import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UPLOAD_PROVIDER } from '../../constants';
import { IUploadProvider } from 'src/common/interfaces/uploadProvider.interface';
import SupportedUploadProviders from './service';

@Global()
@Module({})
export class UploadProviderModule {
  static forRootAsync(): DynamicModule {
    const UploadProvider: Provider = {
      provide: UPLOAD_PROVIDER,
      inject: [ConfigService, ...SupportedUploadProviders],
      useFactory: (
        configService: ConfigService,
        ...supportedProviders: IUploadProvider[]
      ): IUploadProvider => {
        const providerKey = configService.get<string>('upload.provider');

        const selectedProvider = supportedProviders.find(
          (supportedProviders) =>
            supportedProviders.providerKey === providerKey,
        );

        if (!selectedProvider) {
          throw new Error(
            `Unsupported UPLOAD_PROVIDER "${providerKey}". Supported: ${supportedProviders?.map((sProvider) => sProvider.providerKey).join(', ')}`,
          );
        }

        return selectedProvider;
      },
    };

    return {
      module: UploadProviderModule,
      imports: [ConfigModule],
      providers: [...SupportedUploadProviders, UploadProvider],
      exports: [UPLOAD_PROVIDER],
    };
  }
}
