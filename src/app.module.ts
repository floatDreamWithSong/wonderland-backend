import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guards/jwt.guard';
import { WechatModule } from './modules/wechat/wechat.module';
import { UserModule } from './modules/user/user.module';
import { JwtUtilsModule } from './common/utils/jwt/jwt.module';
import { Configurations } from './common/config';

@Module({
  imports: [WechatModule, UserModule, JwtUtilsModule, Configurations],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
