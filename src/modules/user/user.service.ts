import { Injectable } from '@nestjs/common';
import { CosService } from '../cos/cos.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from 'src/types/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly cosService: CosService,
    private readonly prismaService: PrismaService,
  ) {}
  async changeAvatar(file: Express.Multer.File, user: JwtPayload): Promise<string> {
    const res = await this.cosService.uploadFile(file);
    // 删除旧的头像
    const _user = await this.prismaService.user.findUnique({
      where: {
        openId: user.openid,
      },
      select: {
        avatar: true,
      },
    });
    await this.prismaService.user.update({
      where: {
        openId: user.openid,
      },
      data: {
        avatar: res,
      },
    });
    if (_user?.avatar) {
      await this.cosService.deleteFile(_user.avatar.split('myqcloud.com/')[1]);
    }
    return res;
  }
}
