import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../types/jwt-payload.type';
import { UsersService } from '../../users/users.service';
import { Messages } from '../../../core/responses/message.responses';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: IJwtPayload) {
    // check if user in the token actually exist
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(Messages.UNAUTHORIZED);
    }
    return payload;
  }
}
