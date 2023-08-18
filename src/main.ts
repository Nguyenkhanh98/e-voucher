import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestIdMiddleware } from '@common/middlewares/request-id.middleware';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { initSwapper } from '@common/config/swagger';
import { ENV } from '@common/config';
import { AppLogger } from '@common/logger/logger.service';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const httpsOptions = {
    // key: fs.readFileSync(path.join(__dirname, 'configs/secrets/server.key')),
    // cert: fs.readFileSync(path.join(__dirname, 'configs/secrets/server.cert')),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: ENV.NODE_ENV === 'production' && httpsOptions,
    logger: new AppLogger(),
  });
  const logger = app.get(AppLogger);

  app.useLogger(logger);
  app.use(RequestIdMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      transform: true,
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api');
  initSwapper(app);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  logger.log(`App listening at ${port}`);
  await app.listen(port || 3000);
}
bootstrap();
