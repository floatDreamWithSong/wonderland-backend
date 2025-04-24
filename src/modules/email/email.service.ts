import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Redis from 'ioredis';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    // 创建邮件发送器
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    // 创建Redis客户端
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  /**
   * 生成验证码
   */
  private generateVerificationCode(): string {
    return Math.random().toString().slice(2, 8);
  }

  /**
   * 发送验证码邮件
   * @param email 目标邮箱
   */
  async sendVerificationCode(email: string): Promise<void> {
    const code = this.generateVerificationCode();
    const key = `verification:${email}`;

    // 将验证码存储到Redis，设置5分钟过期
    await this.redis.set(key, code, 'EX', 300);

    // 发送邮件
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'WonderLand验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">WonderLand验证码</h2>
          <p style="color: #666;">您的验证码是：</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #999; font-size: 12px;">验证码有效期为5分钟，请勿泄露给他人。</p>
        </div>
      `,
    });
  }

  /**
   * 验证验证码
   * @param email 邮箱
   * @param code 验证码
   */
  async verifyCode(email: string, code: string): Promise<boolean> {
    const key = `verification:${email}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode) {
      return false; // 验证码不存在或已过期
    }

    const isValid = storedCode === code;
    if (isValid) {
      // 验证成功后删除验证码
      await this.redis.del(key);
    }

    return isValid;
  }
}
