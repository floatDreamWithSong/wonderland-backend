/**
 * 统一响应处理类
 */
export class Response<T = any> {
  /**
   * 响应状态码
   */
  code: number;

  /**
   * 响应消息
   */
  message: string;

  /**
   * 响应数据
   */
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * 成功响应
   */
  static success<T>(data?: T, message: string = 'success'): Response<T> {
    return new Response<T>(0, message, data);
  }

  /**
   * 错误响应
   */
  static error(code: number = 500, message: string = 'error'): Response {
    return new Response(code, message);
  }
}
