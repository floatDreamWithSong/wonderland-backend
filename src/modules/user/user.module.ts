import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CosModule } from '../../common/utils/cos/cos.module';
import { EmailModule } from 'src/common/utils/email/email.module';
import { PrismaModule } from 'src/common/utils/prisma/prisma.module';
import { JwtUtilsModule } from 'src/common/utils/jwt/jwt.module';
import { RedisCacheModule } from 'src/common/utils/redis/redis.module';

@Module({
  imports: [CosModule, EmailModule, PrismaModule, RedisCacheModule, JwtUtilsModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
