import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guards/jwt.guard';
import { WechatModule } from './modules/wechat/wechat.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CosModule } from './modules/cos/cos.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [WechatModule, LoggerModule, PrismaModule, CosModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
