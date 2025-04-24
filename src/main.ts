import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter, ErrorFilter } from './common/filters/app-exception.filter';
import { JwtGuard } from './common/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AppExceptionFilter()).useGlobalFilters(new ErrorFilter());
  app.useGlobalGuards(new JwtGuard());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
