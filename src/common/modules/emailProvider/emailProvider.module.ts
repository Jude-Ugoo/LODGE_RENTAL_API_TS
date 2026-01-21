import { Module, DynamicModule, Provider, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { EMAIL_PROVIDER } from "../../constants";
import { IEmailProvider } from "src/common/interfaces/emailProvider.interface";
import SupportedEmailProviders from "./service";
import { SUPPORTED_EMAIL_PROVIDERS } from "../../constants";

@Global()
@Module({})
export class EmailProviderModule {
  static forRootAsync(): DynamicModule {
    const EmailProvider: Provider = {
      provide: EMAIL_PROVIDER,
      inject: [ConfigService, ...SupportedEmailProviders],
      useFactory: (
        configService: ConfigService,
        ...supportedProviders: IEmailProvider[]
      ): IEmailProvider => {
        const providerKey = configService.get<string>("email.provider");

        if (!providerKey) {
          throw new Error("EMAIL_PROVIDER is required");
        }

        const selectedProvider = supportedProviders.find(
          (supportedProvider) => supportedProvider.providerKey === providerKey,
        );

        if (!selectedProvider) {
          throw new Error(
            `Unsupported EMAIL_PROVIDER "${providerKey}". Supported: ${supportedProviders
              ?.map((sProvider) => sProvider.providerKey)
              .join(", ")}`,
          );
        }

        return selectedProvider;
      },
    };

    return {
      module: EmailProviderModule,
      imports: [ConfigModule],
      providers: [...SupportedEmailProviders, EmailProvider],
      exports: [EMAIL_PROVIDER],
    };
  }
}
