import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter, ErrorFilter } from './common/filters/app-exception.filter';
import { JwtGuard } from './common/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AppExceptionFilter()).useGlobalFilters(new ErrorFilter());
  app.useGlobalGuards(new JwtGuard());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Server is running on port', port);
}
void bootstrap();
