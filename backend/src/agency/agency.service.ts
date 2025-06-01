import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Agency } from './entities/agency.entity';
import { CreateAgencyDto } from './dtos/create-agency.dto';

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Agency)
        private usersRepository: Repository<Agency>,
    ) { }

    async createUser(dto: CreateAgencyDto): Promise<Agency> {
        const existing = await this.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = this.usersRepository.create({
            ...dto,
            password: hashedPassword,
        });

        return this.usersRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<Agency | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password']
        });
    }

    async findById(id: number): Promise<Agency> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
