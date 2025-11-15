import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET!, // dấu ! để chắc chắn không undefined
});

  }

  async validate(payload: any) {
    // payload = { id, role }
    return { id: payload.id, role: payload.role }; // sẽ gán vào req.user
  }
}
