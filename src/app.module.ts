import { Module } from '@nestjs/common';
import { WechatModule } from './modules/wechat/wechat.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [WechatModule, LoggerModule, PrismaModule],
})
export class AppModule {}
