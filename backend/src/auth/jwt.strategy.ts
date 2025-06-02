import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from './enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
        });
    }

    async validate(payload: any) {
        if(payload.agencyEmail)
        return { agencyId: payload.sub, agencyEmail: payload.agencyEmail,role:Role.AGENCY };
        return { userId: payload.sub, email: payload.email , role : payload.role };
    }
}
