import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter, ErrorFilter } from './common/filters/app-exception.filter';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  app.useGlobalFilters(new ErrorFilter()).useGlobalFilters(new AppExceptionFilter());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Server is running on port', port);
}
void bootstrap();
