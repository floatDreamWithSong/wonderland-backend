import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Configurations } from 'src/common/config';
import { lastValueFrom } from 'rxjs';
import { JwtUtils } from 'src/common/utils/jwt';
import { WechatRegisterByPhoneDto } from 'src/validation/wechat';
import { WXBizDataCrypt } from 'src/common/utils/decrypt';
import { RedisService } from '../redis/redis.service'; // 导入 RedisService

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);
  private readonly jwtUtils = new JwtUtils();
  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService, // 注入 RedisService
  ) {}

  async loginByCode(code: string): Promise<{ token: string }> {
    const endPointUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${Configurations.WX_APPID}&secret=${Configurations.WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
    this.logger.log('微信登录请求地址:', endPointUrl);
    const response = await lastValueFrom(
      this.httpService.get<{
        openid: string;
        session_key: string;
      }>(endPointUrl),
    );
    this.logger.log('微信登录返回数据:', response.data);

    // 使用 RedisService 存储 session_key
    this.redisService.setSessionKeyByOpenid(response.data.openid, response.data.session_key);

    const jwtToken = this.jwtUtils.sign({
      openid: response.data.openid,
      iat: Math.floor(Date.now() / 1000),
    });
    this.logger.log('jwtToken:', jwtToken);

    return {
      token: jwtToken,
    };
  }

  async registerPhone(data: WechatRegisterByPhoneDto, openid: string) {
    this.logger.log('微信注册手机号:', data);
    const sessionKey = await this.redisService.getSessionKeyByOpenid(openid);
    if (!sessionKey) throw new Error('session_key not found');
    this.logger.log('sessionKey:', sessionKey);
    const phoneData = new WXBizDataCrypt(Configurations.WX_APPID, sessionKey).decryptData<{
      phoneNumber: string;
      purePhoneNumber: string;
      countryCode: string;
    }>(data.encryptedData, data.iv);
    this.logger.log('phoneData:', phoneData);
  }
}
