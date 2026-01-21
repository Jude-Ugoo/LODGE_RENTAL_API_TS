import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './config/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('APP');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');
  const appUrl = `http://localhost:${port || 8000}`;

  const environment = configService.get('NODE_ENV');

  // app.use(helmet({ noSniff: true }));

  // Global pipes, filters, interceptors
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // app.enableCors({
  //   origin: getAllowedOrigins(environment),
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });

  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   logger.log(`Request: ${req.method} ${req.originalUrl}`);
  //   next();
  // });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Oko Lodge API')
    .setDescription('API documentation for Oko Lodge')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
    },
  });

  await app.listen(port, () =>
    logger.debug(`Server listening on ${appUrl || 8000}`),
  );
  logger.debug(`📘 Swagger Docs available at: ${appUrl}/docs`);
}

bootstrap();
