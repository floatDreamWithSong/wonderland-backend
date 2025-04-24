import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: '手机号' })
  phone: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '头像' })
  avatar: string;

  @ApiProperty({ description: '用户类型', enum: [0, 1], default: 0 })
  userType: number;

  @ApiProperty({ description: '邮箱', required: false })
  email?: string;

  @ApiProperty({ description: '私域标识码', required: false })
  privateId?: string;

  @ApiProperty({ description: '密码', required: false })
  password?: string;

  @ApiProperty({ description: '注册时间' })
  registerTime: Date;
}
