import { Module } from '@nestjs/common';
import { WechatModule } from './modules/wechat/wechat.module';

@Module({
  imports: [WechatModule],
})
export class AppModule {}
