import { Controller, Get, Post, Body, Query, Logger, HttpStatus, HttpCode } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { WechatService } from './wechat.service';
import { WechatEncryptedDataDto, WeChatEncryptedDataSchema } from 'src/validators/wechat';
import { ZodValidationPipe } from 'src/common/pipes/zod-validate.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';
import { MakeResponse } from 'src/common/utils/response';

@Controller('/wechat')
export class WechatController {
  private readonly logger = new Logger(WechatController.name);
  constructor(private readonly wechatService: WechatService) {}

  @Public()
  @Get('/auth/login')
  async create(@Query('code') code: string) {
    this.logger.log(`Received code: ${code}`); // 添加这行查看实际收到的 code
    const token = await this.wechatService.loginByCode(code);
    return MakeResponse.success({
      token: token,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register/phone')
  async registerByPhone(
    @Body(new ZodValidationPipe(WeChatEncryptedDataSchema)) body: WechatEncryptedDataDto,
    @User() user: JwtPayload,
  ) {
    this.logger.log(`Received body: ${JSON.stringify(body)}`); // 添加这行查看实际收到的 body
    this.logger.log(`Received user: ${JSON.stringify(user)}`); // 添加这行查看实际收到的 user
    const new_user = await this.wechatService.registerPhone(body, user.openid);
    return MakeResponse.success(new_user);
  }
}
