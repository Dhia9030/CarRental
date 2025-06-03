import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { UserService } from '../user/user.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const token = client.handshake.query.token;

        if (!token) {
            throw new WsException('Missing authentication token');
        }

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.userId);

            if (!user) {
                throw new WsException('User not found');
            }

            // Attach user to socket
            client.user = user;
            return true;
        } catch (err) {
            throw new WsException('Invalid credentials');
        }
    }
}