import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

// 微信登录请求DTO验证模式
export const WxLoginSchema = z.object({
  code: z.string().min(1, '登录code不能为空'),
});

// 微信登录请求DTO
export class WxLoginDto {
  @ApiProperty({ description: '微信登录code' })
  code: string;
}

// 微信手机号解密请求DTO验证模式
export const WxPhoneSchema = z.object({
  encryptedData: z.string().min(1, '加密数据不能为空'),
  iv: z.string().min(1, 'iv不能为空'),
  openid: z.string().min(1, 'openid不能为空'),
});

// 微信手机号解密请求DTO
export class WxPhoneDto {
  @ApiProperty({ description: '加密的手机号数据' })
  encryptedData: string;

  @ApiProperty({ description: '加密算法的初始向量' })
  iv: string;

  @ApiProperty({ description: '用户的openid' })
  openid: string;
}

// 邮箱验证码登录请求DTO验证模式
export const EmailLoginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  code: z.string().length(6, '验证码必须是6位'),
});

// 邮箱验证码登录请求DTO
export class EmailLoginDto {
  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '验证码' })
  code: string;
}

// 私域标识码登录请求DTO验证模式
export const PrivateIdLoginSchema = z.object({
  privateId: z.string().min(1, '私域标识码不能为空'),
  password: z.string().min(6, '密码不能少于6位'),
});

// 私域标识码登录请求DTO
export class PrivateIdLoginDto {
  @ApiProperty({ description: '私域标识码' })
  privateId: string;

  @ApiProperty({ description: '密码' })
  password: string;
}

// 发送邮箱验证码请求DTO验证模式
export const SendEmailCodeSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
});

// 发送邮箱验证码请求DTO
export class SendEmailCodeDto {
  @ApiProperty({ description: '邮箱' })
  email: string;
}
