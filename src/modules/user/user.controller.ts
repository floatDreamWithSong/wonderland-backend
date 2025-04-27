import { Controller, HttpCode, HttpStatus, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/types/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
