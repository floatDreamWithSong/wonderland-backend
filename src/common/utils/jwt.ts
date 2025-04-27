import { JwtService } from '@nestjs/jwt';
import { Configurations } from '../config';
import { JwtPayload } from 'src/types/jwt';
import { Injectable } from '@nestjs/common';
import { CryptoUtils } from './utils';

@Injectable()
export class JwtUtils {
  private readonly jwtService: JwtService;
  constructor() {
    this.jwtService = new JwtService({
      secret: Configurations.JWT_SECRET,
      signOptions: { expiresIn: Configurations.JWT_EXPIRATION_TIME },
    });
  }

  sign(payload: JwtPayload): string {
    return this.jwtService.sign(
      {
        ...payload,
        openid: CryptoUtils.encrypt(payload.openid),
      },
      {
        secret: Configurations.JWT_SECRET,
        expiresIn: Configurations.JWT_EXPIRATION_TIME,
      },
    );
  }

  verify(token: string) {
    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: Configurations.JWT_SECRET,
    });
    payload.openid = CryptoUtils.decrypt(payload.openid);
    return payload;
  }
}
