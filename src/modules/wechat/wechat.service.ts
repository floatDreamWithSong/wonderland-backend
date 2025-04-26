import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Configurations } from 'src/common/config';
import { lastValueFrom } from 'rxjs';
import { JwtUtils } from 'src/common/utils/jwt';
import { WechatEncryptedDataDto, WeChatOpenidSessionKeySchema } from 'src/validators/wechat';
import { WXBizDataCrypt } from 'src/common/utils/decrypt';
import { EXCEPTIONS } from 'src/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);
  private readonly jwtUtils = new JwtUtils();

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  private async setSessionKeyByOpenid(openid: string, sessionKey: string) {
    // Store session key with 2 hour expiration
    await this.redisService.set(`wx:session:${openid}`, sessionKey, 'EX', 2 * 60 * 60);
  }

  private async getSessionKeyByOpenid(openid: string): Promise<string | null> {
    return await this.redisService.get(`wx:session:${openid}`);
  }

  async loginByCode(code: string): Promise<string> {
    const endPointUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${Configurations.WX_APPID}&secret=${Configurations.WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
    this.logger.log('微信登录请求地址:' + endPointUrl);
    const response = await lastValueFrom(
      this.httpService.get<{
        openid: string;
        session_key: string;
      }>(endPointUrl),
    );
    const result = WeChatOpenidSessionKeySchema.safeParse(response.data);
    if (!result.success) {
      this.logger.error('微信登录返回数据错误:' + JSON.stringify(response.data));
      throw EXCEPTIONS.WX_LOGIN_DATA_ERROR;
    }
    this.logger.log(`微信登录返回数据:${JSON.stringify(response.data)}`);

    // 使用 RedisService 存储 session_key
    await this.setSessionKeyByOpenid(response.data.openid, response.data.session_key);

    const jwtToken = this.jwtUtils.sign({
      openid: response.data.openid,
      iat: Math.floor(Date.now() / 1000),
    });
    this.logger.log(`jwtToken: ${jwtToken}`);

    return jwtToken;
  }

  async registerPhone(data: WechatEncryptedDataDto, openid: string) {
    this.logger.log(`微信注册手机号:${JSON.stringify(data)}`);
    const sessionKey = await this.getSessionKeyByOpenid(openid);
    if (!sessionKey) throw EXCEPTIONS.WX_SESSION_KEY_NOT_FOUND;
    this.logger.log('sessionKey: ' + sessionKey);
    const phoneData = new WXBizDataCrypt(Configurations.WX_APPID, sessionKey).decryptData<{
      phoneNumber: string;
      purePhoneNumber: string;
      countryCode: string;
    }>(data.encryptedData, data.iv);
    this.logger.log('phoneData: ' + JSON.stringify(phoneData));

    // 创建新用户
    const user = await this.prisma.user.create({
      data: {
        openId: openid,
        phone: phoneData.phoneNumber,
        username: `用户${Math.random().toString(36).slice(2, 8)}`, // 生成随机用户名
        avatar: '', // 默认空头像
        gender: 0, // 默认未知性别
        userType: 0, // 默认游客
      },
    });

    return {
      gender: user.gender,
      username: user.username,
      avatar: user.avatar,
      userType: user.userType,
      email: user.email,
      // 手机号需要脱敏
      phone: phoneData.phoneNumber.slice(0, 3) + '****' + phoneData.phoneNumber.slice(-4),
      privateId: user.privateId,
      registerTime: user.registerTime,
    };
  }
}
