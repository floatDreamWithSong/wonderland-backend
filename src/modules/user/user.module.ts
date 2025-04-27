import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CosModule } from '../cos/cos.module';

@Module({
  imports: [CosModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
