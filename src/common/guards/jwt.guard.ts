import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { JwtUtils } from '../utils/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);
  private readonly jwtUtils: JwtUtils;

  constructor() {
    this.jwtUtils = new JwtUtils();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    // 排除不需要验证的路径
    const excludedPaths = ['/wechat/auth/login'];
    if (excludedPaths.includes(request.path)) {
      return true;
    }

    if (!authHeader) {
      return false;
    }

    try {
      const token = authHeader;
      const payload = this.jwtUtils.verify(token);
      request['user'] = payload;
      return true;
    } catch (err) {
      this.logger.error('JWT verification failed:', err);
      return false;
    }
  }
}
