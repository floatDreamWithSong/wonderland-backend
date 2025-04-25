import { Module } from '@nestjs/common';
import { WechatModule } from './modules/wechat/wechat.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [WechatModule, LoggerModule],
})
export class AppModule {}
