import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { UserRepositoryInterface } from '../../domain/interfaces/UserRepositoryInterface';
import { User, UserProps } from '../../domain/entities/User';
import { isValidPassword } from '../../utility/password.utility';
import { prisma } from '../database/db';

export class UserRepositoryDatabase implements UserRepositoryInterface {

    async create(user: User): Promise<User> {
        const created = await prisma.user.create({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                salt: user.salt,
            },
        });

        return new User(created as UserProps);
    }

    async login(email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        const isValid = await isValidPassword(password, user.password, user.salt);
        if (!isValid) return null;

        return new User(user as UserProps);
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    async update(id: string, user: User): Promise<User> {
        const updated = await prisma.user.update({
            where: { id },
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
                salt: user.salt,
            },
        });

        return new User(updated as UserProps);
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return new User(user as UserProps);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        return new User(user as UserProps);
    }

    async updateOtpFields(id: string, otpSecret: string | null, otpEnable: number): Promise<User> {
        const updated = await prisma.user.update({
            where: { id },
            data: {
                otp_secret: otpSecret,
                otp_enable: otpEnable,
            },
        });

        return new User(updated as UserProps);
    }
}
