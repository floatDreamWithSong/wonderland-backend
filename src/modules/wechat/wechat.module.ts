import { Module } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatController } from './wechat.controller';
import { HttpModule } from '@nestjs/axios';
import { Configurations } from 'src/common/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: Configurations.HTTP_TIMEOUT,
        maxRedirects: Configurations.HTTP_MAX_REDIRECTS,
      }),
    }),
    RedisModule,
    Configurations,
  ],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule {}
