import { JwtUtils } from './jwt';
import { Configurations } from '../config';
import { JwtPayload } from 'src/types/jwt';

describe('JwtUtils', () => {
  let jwtUtils: JwtUtils;
  const testPayload: JwtPayload = { openid: '123', iat: 0 };

  beforeAll(() => {
    // 确保配置中有JWT密钥和过期时间
    if (!Configurations.JWT_SECRET) {
      Configurations.JWT_SECRET = 'test-secret-key-32-characters-long';
    }
    if (!Configurations.JWT_EXPIRATION_TIME) {
      Configurations.JWT_EXPIRATION_TIME = '3600s';
    }

    jwtUtils = new JwtUtils();
  });

  it('should sign payload and return token', () => {
    const token = jwtUtils.sign(testPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT由三部分组成
  });

  it('should verify valid token', async () => {
    const token = jwtUtils.sign(testPayload);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待1秒以确保token未过期
    const decoded = jwtUtils.verify(token);

    expect(decoded).toBeDefined();
    expect(decoded.openid).toBe(testPayload.openid);
    expect(decoded.iat).toBeDefined(); // 签发时间应该存在
  });

  it('should throw error for invalid token', () => {
    const invalidToken = 'invalid.token.here';
    expect(() => jwtUtils.verify(invalidToken)).toThrow();
  });

  it('should throw error for expired token', async () => {
    // 创建过期时间为1秒前的token
    Configurations.JWT_EXPIRATION_TIME = '1s'; // 设置过期时间为1秒
    const expiredPayload = { ...testPayload };
    const expiredToken = jwtUtils.sign(expiredPayload);
    await new Promise((resolve) => setTimeout(resolve, 1100)); // 等待1.1秒以确保token过期
    // 恢复过期时间配置
    Configurations.JWT_EXPIRATION_TIME = '7200s'; // 恢复为默认值
    console.log('Expired token:', expiredToken);
    try {
      jwtUtils.verify(expiredToken);
    } catch (err) {
      console.log('Token expired:', err);
    }
    expect(() => jwtUtils.verify(expiredToken)).toThrow();
  });
  it('should throw error for token with wrong secret', () => {
    const token = jwtUtils.sign(testPayload);
    // 修改配置中的密钥
    const originalSecret = Configurations.JWT_SECRET;
    Configurations.JWT_SECRET = 'wrong-secret-key-32-characters';

    expect(() => jwtUtils.verify(token)).toThrow();

    // 恢复原始密钥
    Configurations.JWT_SECRET = originalSecret;
  });
});
