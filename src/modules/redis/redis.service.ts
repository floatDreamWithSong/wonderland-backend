import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly map = new Map<string, string>();

  async getSessionKeyByOpenid(openid: string): Promise<string | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return this.map.get(openid);
  }
  setSessionKeyByOpenid(openid: string, sessionKey: string) {
    this.map.set(openid, sessionKey);
  }
}
