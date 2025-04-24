import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from '../../common/response/response';
import {
  EmailLoginDto,
  PrivateIdLoginDto,
  SendEmailCodeDto,
  WxLoginDto,
  WxPhoneDto,
} from './dto/user.dto';
import { User } from './entities/user.entity';

@ApiTags('用户')
@Controller('user')
export class UserController {
  @Post('wx/login')
  @ApiOperation({ summary: '微信临时登录' })
  @ApiResponse({ status: 200, type: Response })
  async wxLogin(@Body() wxLoginDto: WxLoginDto) {
    // TODO: 实现微信临时登录逻辑
    return Response.success({ token: 'token' });
  }

  @Post('wx/phone')
  @ApiOperation({ summary: '解密微信手机号' })
  @ApiResponse({ status: 200, type: Response })
  async wxPhone(@Body() wxPhoneDto: WxPhoneDto) {
    // TODO: 实现微信手机号解密逻辑
    return Response.success({ phone: '13800138000' });
  }

  @Post('email/code')
  @ApiOperation({ summary: '发送邮箱验证码' })
  @ApiResponse({ status: 200, type: Response })
  async sendEmailCode(@Body() sendEmailCodeDto: SendEmailCodeDto) {
    // TODO: 实现发送邮箱验证码逻辑
    return Response.success();
  }

  @Post('email/login')
  @ApiOperation({ summary: '邮箱验证码登录' })
  @ApiResponse({ status: 200, type: Response })
  async emailLogin(@Body() emailLoginDto: EmailLoginDto) {
    // TODO: 实现邮箱验证码登录逻辑
    return Response.success({ token: 'token' });
  }

  @Post('private/login')
  @ApiOperation({ summary: '私域标识码登录' })
  @ApiResponse({ status: 200, type: Response })
  async privateLogin(@Body() privateLoginDto: PrivateIdLoginDto) {
    // TODO: 实现私域标识码登录逻辑
    return Response.success({ token: 'token' });
  }
}
