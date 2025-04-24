import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, OnModuleInit } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 配置模块全局可用
      envFilePath: '.env', // 指定 .env 文件路径
    }),
  ],
})
export class Configurations implements OnModuleInit {
  private static configService: ConfigService;

  // 静态字段，用于直接访问环境变量
  static HTTP_TIMEOUT = 5000;
  static HTTP_MAX_REDIRECTS = 5;
  static DATABASE_URL: string;
  static JWT_SECRET: string;
  static JWT_EXPIRATION_TIME: string;
  static MAIL_HOST: string;
  static MAIL_PORT: number;
  static MAIL_USER: string;
  static MAIL_PASS: string;
  static WX_APPID: string;
  static WX_SECRET: string;
  static OSS_ACCESS_KEY_ID: string;
  static OSS_ACCESS_KEY_SECRET: string;
  static OSS_BUCKET: string;
  static OSS_ENDPOINT: string;
  static TEST_ENV_VAR: string;
  static CRYPTO_SECRET: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    Configurations.configService = this.configService;

    // 使用getOrThrow确保必须读取到环境变量
    Configurations.DATABASE_URL = this.configService.getOrThrow<string>('DATABASE_URL');
    Configurations.JWT_SECRET = this.configService.getOrThrow<string>('JWT_SECRET');
    Configurations.JWT_EXPIRATION_TIME = this.configService.getOrThrow<string>('JWT_EXPIRATION_TIME');
    Configurations.MAIL_HOST = this.configService.getOrThrow<string>('MAIL_HOST');
    Configurations.MAIL_PORT = this.configService.getOrThrow<number>('MAIL_PORT');
    Configurations.MAIL_USER = this.configService.getOrThrow<string>('MAIL_USER');
    Configurations.MAIL_PASS = this.configService.getOrThrow<string>('MAIL_PASS');
    Configurations.WX_APPID = this.configService.getOrThrow<string>('WX_APPID');
    Configurations.WX_SECRET = this.configService.getOrThrow<string>('WX_SECRET');
    Configurations.OSS_ACCESS_KEY_ID = this.configService.getOrThrow<string>('OSS_ACCESS_KEY_ID');
    Configurations.OSS_ACCESS_KEY_SECRET = this.configService.getOrThrow<string>('OSS_ACCESS_KEY_SECRET');
    Configurations.OSS_BUCKET = this.configService.getOrThrow<string>('OSS_BUCKET');
    Configurations.OSS_ENDPOINT = this.configService.getOrThrow<string>('OSS_ENDPOINT');
    Configurations.CRYPTO_SECRET = this.configService.getOrThrow<string>('CRYPTO_SECRET');

    Configurations.TEST_ENV_VAR = this.configService.getOrThrow<string>('TEST_ENV_VAR');
    console.log('Configurations.TEST_ENV_VAR', Configurations.TEST_ENV_VAR);
    // 对于HTTP_TIMEOUT和HTTP_MAX_REDIRECTS这类有默认值的配置可以保持原样
  }

  // 提供一个静态方法来访问环境变量
  static getEnvVariable(key: string): string | undefined {
    return this.configService.get<string>(key);
  }
}
