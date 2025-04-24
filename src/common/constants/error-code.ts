/**
 * 错误码枚举
 */
export enum ErrorCode {
  // 系统错误码 (1000-1999)
  SYSTEM_ERROR = 1000,
  PARAMS_ERROR = 1001,
  NOT_FOUND = 1002,
  UNAUTHORIZED = 1003,
  FORBIDDEN = 1004,

  // 用户相关错误码 (2000-2999)
  USER_NOT_FOUND = 2000,
  USER_ALREADY_EXISTS = 2001,
  INVALID_PASSWORD = 2002,
  INVALID_CODE = 2003,
  CODE_EXPIRED = 2004,
  EMAIL_ALREADY_EXISTS = 2005,
  PRIVATE_ID_ALREADY_EXISTS = 2006,
  PHONE_ALREADY_EXISTS = 2007,
  DECRYPT_FAILED = 2008,
}

/**
 * 错误信息映射
 */
export const ErrorMessage = {
  [ErrorCode.SYSTEM_ERROR]: '系统错误',
  [ErrorCode.PARAMS_ERROR]: '参数错误',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.UNAUTHORIZED]: '未授权',
  [ErrorCode.FORBIDDEN]: '无权限访问',

  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
  [ErrorCode.INVALID_PASSWORD]: '密码错误',
  [ErrorCode.INVALID_CODE]: '验证码错误',
  [ErrorCode.CODE_EXPIRED]: '验证码已过期',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: '邮箱已存在',
  [ErrorCode.PRIVATE_ID_ALREADY_EXISTS]: '私域标识码已存在',
  [ErrorCode.PHONE_ALREADY_EXISTS]: '手机号已存在',
  [ErrorCode.DECRYPT_FAILED]: '数据解密失败',
};
