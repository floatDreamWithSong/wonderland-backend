import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatEncryptedDataDto, WeChatEncryptedDataSchema } from 'src/validation/wechat';
import { ZodValidationPipe } from 'src/common/pipes/zod-validate.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';

@Controller('/wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Get('/auth/login')
  create(@Query('code') code: string) {
    return this.wechatService.loginByCode(code);
  }

  @Post('/register/phone')
  async registerByPhone(
    @Body(new ZodValidationPipe(WeChatEncryptedDataSchema)) body: WechatEncryptedDataDto,
    @User() user: JwtPayload,
  ) {
    console.log('Received body:', body); // 添加这行查看实际收到的数据
    return await this.wechatService.registerPhone(body, user.openid);
  }
}
