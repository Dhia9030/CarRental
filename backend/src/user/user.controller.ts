import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User , Agency } from 'src/auth/decorators/auth.decorators';

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@User() user , @Agency() agency) {
        return {...agency};
    }
}
