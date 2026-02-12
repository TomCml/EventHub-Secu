import { UserRepositoryInterface } from "../../../domain/interfaces/UserRepositoryInterface";
import { User, UserProps } from "../../../domain/entities/User";
import { generateSalt, hashPassword, generateSignature } from "../../../utility/password.utility";
import { randomUUID } from "crypto";

export interface RegisterUserInput {
    username: string;
    email: string;
    password: string;
}

export interface RegisterUserOutput {
    user: {
        id: string;
        username: string;
        email: string;
        createdAt: Date;
    };
    token: string;
}

export class RegisterUserUseCase {
    constructor(private readonly userRepository: UserRepositoryInterface) { }

    async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
        // Validations
        if (!input.username || input.username.trim() === '') {
            throw new Error('Username is required');
        }

        if (!input.email || input.email.trim() === '') {
            throw new Error('Email is required');
        }

        if (!input.password || input.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const salt = await generateSalt();
        const hashedPassword = await hashPassword(input.password, salt);

        // Create user
        const userProps: UserProps = {
            id: randomUUID(),
            username: input.username,
            email: input.email,
            password: hashedPassword,
            salt: salt,
            otp_secret: null,
            otp_enable: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const user = new User(userProps);

        const createdUser = await this.userRepository.create(user);

        // Generate token
        const token = generateSignature({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
            updatedAt: createdUser.updatedAt,
        });

        return {
            user: {
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email,
                createdAt: createdUser.createdAt,
            },
            token,
        };
    }
}
