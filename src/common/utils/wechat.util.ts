import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

interface WxCode2SessionResult {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class WechatUtil {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 调用微信code2Session接口获取openid
   * @param code 小程序登录时获取的code
   */
  async code2Session(code: string): Promise<WxCode2SessionResult> {
    const appId = this.configService.get<string>('WECHAT_APP_ID');
    const appSecret = this.configService.get<string>('WECHAT_APP_SECRET');
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    const response = await firstValueFrom(
      this.httpService.get<WxCode2SessionResult>(url),
    );
    return response.data;
  }

  /**
   * 解密微信加密数据
   * @param encryptedData 加密数据
   * @param iv 加密算法的初始向量
   * @param sessionKey 会话密钥
   */
  decryptData(encryptedData: string, iv: string, sessionKey: string) {
    // Base64解码
    const sessionKeyBuffer = Buffer.from(sessionKey, 'base64');
    const encryptedDataBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');

    try {
      // 解密
      const decipher = crypto.createDecipheriv(
        'aes-128-cbc',
        sessionKeyBuffer,
        ivBuffer,
      );
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);

      let decoded = decipher.update(encryptedDataBuffer, undefined, 'utf8');
      decoded += decipher.final('utf8');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(decoded);
    } catch (err) {
      throw new Error('解密失败：' + err);
    }
  }
}
