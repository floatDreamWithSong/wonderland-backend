import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatEncryptedDataDto, WeChatEncryptedDataSchema } from 'src/validation/wechat';
import { ZodValidationPipe } from 'src/common/pipes/zod-validate.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';

@Controller('/wechat')
export class WechatController {
  private readonly logger = new Logger(WechatController.name);
  constructor(private readonly wechatService: WechatService) {}

  @Get('/auth/login')
  create(@Query('code') code: string) {
    this.logger.log(`Received code: ${code}`); // 添加这行查看实际收到的 code
    return this.wechatService.loginByCode(code);
  }

  @Post('/register/phone')
  async registerByPhone(
    @Body(new ZodValidationPipe(WeChatEncryptedDataSchema)) body: WechatEncryptedDataDto,
    @User() user: JwtPayload,
  ) {
    this.logger.log(`Received body: ${JSON.stringify(body)}`); // 添加这行查看实际收到的 body
    this.logger.log(`Received user: ${JSON.stringify(user)}`); // 添加这行查看实际收到的 user
    return await this.wechatService.registerPhone(body, user.openid);
  }
}
