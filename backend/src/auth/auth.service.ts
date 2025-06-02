import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AgencyService } from '../agency/agency.service';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private agencyService: AgencyService,
        private jwtService: JwtService,
    ) { }
    private async validateCredentials(email: string, password:string, service:any):Promise<any>{
        const generalUser = await service.findByEmail(email);
        if (generalUser && await bcrypt.compare(password, generalUser.password)) {
            const { password, ...result } = generalUser;
            return result;
        }
        return null;
    }
    async validateUser(email: string, password: string): Promise<any> {
        return this.validateCredentials(email,password,this.usersService);
    }

    async validateAgency(email: string, password: string): Promise<any> {
        return this.validateCredentials(email,password,this.agencyService);
    }

    private createPayload(user: any, role:string){
        if(role== Role.AGENCY){
            return {
                agencyEmail : user.email,
                sub : user.id,
                role,
            }
        }
        return {
            email : user.email,
            sub : user.id,
            role : user.role || Role.USER,
        }
    }
    async login(user: any , role : string) {
        const payload = this.createPayload(user,role);
        return {
            access_token: this.jwtService.sign(payload),
        }; 
    }
}
