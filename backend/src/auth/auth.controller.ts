import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AgencyService } from 'src/agency/agency.service';
import { CreateAgencyDto } from 'src/agency/dtos/create-agency.dto';
import { User, Agency } from 'src/auth/decorators/auth.decorators';
import { Role } from './enums/role.enum';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UserService,
        private agencyService: AgencyService
    ) { }

    @Post('AgencyLogin')
    async agencyLogin(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateAgency(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user, Role.AGENCY);
    }

    @Post('AgencyRegister')
    async agencyRegister(@Body() createAgencyDto: CreateAgencyDto) {
        const user = await this.agencyService.createUser(createAgencyDto);
        return this.authService.login(user, Role.AGENCY);
    }

    @Post('UserLogin')
    async userLogin(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user, Role.USER);
    }

    @Post('UserRegister')
    async userRegister(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.createUser(createUserDto);
        return this.authService.login(user, Role.USER);
    }


}
