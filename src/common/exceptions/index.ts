export class AppException extends Error {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly details?: any,
  ) {
    super(message);
  }
}

export class WXBizDataException extends AppException {
  constructor(message: string, details?: any) {
    super(40001, `微信数据解密错误: ${message}`, details);
  }
}

export const EXCEPTIONS = {
  WX_ILLEGAL_BUFFER: new WXBizDataException('非法缓冲区'),
  WX_APPID_MISMATCH: new WXBizDataException('AppID不匹配'),
};
