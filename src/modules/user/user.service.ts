import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../common/constants/error-code';
import {
  WxLoginDto,
  WxPhoneDto,
  EmailLoginDto,
  PrivateIdLoginDto,
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { WechatUtil } from '../../common/utils/wechat.util';
import { EmailService } from '../email/email.service';
import { PrismaClient } from 'src/prisma-generated';
import { PrismaClientExtends } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaClient,
    private jwtService: JwtService,
    private configService: ConfigService,
    private wechatUtil: WechatUtil,
    private emailService: EmailService,
  ) {}

  /**
   * 生成JWT令牌
   */
  private generateToken(payload: { phone: string; userType: number }) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  /**
   * 微信临时登录
   */
  async wxLogin(wxLoginDto: WxLoginDto) {
    const { code } = wxLoginDto;
    const { openid, session_key } = await this.wechatUtil.code2Session(code);
    if (!openid) {
      throw new UnauthorizedException('微信登录失败');
    }

    // 保存session_key
    await this.prisma.wechatSession.upsert({
      where: { openid },
      update: { sessionKey: session_key },
      create: { openid, sessionKey: session_key },
    });

    // 生成临时token
    const token = this.jwtService.sign(
      { openid, type: 'temporary' },
      { expiresIn: '2h' },
    );

    return { token, openid };
  }

  /**
   * 解密微信手机号
   */
  async decryptWxPhone(wxPhoneDto: WxPhoneDto) {
    const { encryptedData, iv, openid } = wxPhoneDto;
    try {
      // 获取session_key
      const session = await this.prisma.wechatSession.findUnique({
        where: { openid },
      });

      if (!session) {
        throw new UnauthorizedException('登录已过期');
      }

      // 解密手机号
      const decryptedData = this.wechatUtil.decryptData(
        encryptedData,
        iv,
        session.sessionKey,
      );

      const phone = decryptedData.phoneNumber;

      // 检查手机号是否已注册
      const existingUser = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (!existingUser) {
        // 注册游客用户
        await this.prisma.user.create({
          data: {
            phone,
            username: `游客${phone.slice(-4)}`,
            avatar: 'default_avatar.png',
            userType: 0,
            registerTime: new Date(),
          },
        });
      }

      // 生成JWT token
      const token = this.generateToken({
        phone,
        userType: existingUser?.userType || 0,
      });

      return { token, phone };
    } catch (error) {
      throw new BadRequestException('手机号解密失败：' + error.message);
    }
  }

  /**
   * 发送邮箱验证码
   */
  async sendEmailCode(email: string) {
    await this.emailService.sendVerificationCode(email);
    return true;
  }

  /**
   * 邮箱验证码登录
   */
  async emailLogin(emailLoginDto: EmailLoginDto) {
    const { email, code } = emailLoginDto;

    const isValid = await this.emailService.verifyCode(email, code);
    if (!isValid) {
      throw new UnauthorizedException('验证码无效或已过期');
    }

    // 查找用户
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 生成JWT token
    const token = this.generateToken({
      phone: user.phone,
      userType: user.userType,
    });

    return { token };
  }

  /**
   * 私域标识码登录
   */
  async privateLogin(privateLoginDto: PrivateIdLoginDto) {
    const { privateId, password } = privateLoginDto;

    // 查询用户
    const user = await this.prisma.user.findFirst({
      where: { privateId },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('私域标识码或密码错误');
    }

    // 生成JWT token
    const token = this.generateToken({
      phone: user.phone,
      userType: user.userType,
    });

    return { token };
  }

  /**
   * 批量注册私域用户
   */
  async batchRegisterPrivateUsers(
    users: Array<{
      phone: string;
      username: string;
      email: string;
      privateId: string;
      password: string;
    }>,
  ): Promise<
    Array<{
      phone: string;
      success: boolean;
      message: string;
    }>
  > {
    const results: Array<{
      phone: string;
      success: boolean;
      message: string;
    }> = [];

    for (const userData of users) {
      try {
        // 检查手机号是否已存在
        const existingUser = await this.prisma.user.findUnique({
          where: { phone: userData.phone },
        });

        if (existingUser) {
          results.push({
            phone: userData.phone,
            success: false,
            message: '手机号已存在',
          });
          continue;
        }

        // 创建私域用户
        await this.prisma.user.create({
          data: {
            ...userData,
            userType: 1,
            avatar: 'default_avatar.png',
            registerTime: new Date(),
          },
        });

        results.push({
          phone: userData.phone,
          success: true,
          message: '注册成功',
        });
      } catch (error) {
        results.push({
          phone: userData.phone,
          success: false,
          message: '注册失败：' + error,
        });
      }
    }

    return results;
  }
}
