import { Body, Controller, HttpCode, HttpStatus, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';
import { UserType } from 'src/common/decorators/user-type.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 修改头像
  @HttpCode(HttpStatus.OK)
  @Put('avatar')
  @UseInterceptors(FileInterceptor('image'))
  changeAvatar(@UploadedFile() image: Express.Multer.File, @User() user: JwtPayload) {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/webp', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(image.mimetype)) {
      throw new Error('不支持的文件类型，仅支持 JPG、PNG、GIF WEBP 格式');
    }
    return this.userService.changeAvatar(image, user);
  }

  // 发送邮箱验证码，只向未认证用户发送，并且邮箱是私域数据表中的合法邮箱
  @HttpCode(HttpStatus.OK)
  @Post('sendVerifyCode')
  @UserType('onlyUnAuthedUser')
  async sendVerifyCode(@Body('email') email: string, @User() user: JwtPayload) {
    await this.userService.sendVerifyCode(email, user.openid);
    return null;
  }

  // 验证邮箱验证码，成为私域认证用户
  @HttpCode(HttpStatus.OK)
  @Post('verifyCode')
  @UserType('onlyUnAuthedUser')
  async verifyCode(@Body('email') email: string, @Body('code') code: string, @User() user: JwtPayload) {
    return this.userService.verifyCode(email, code, user.openid);
  }
}
