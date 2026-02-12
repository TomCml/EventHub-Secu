import { verify as otpVerify } from 'otplib';
import { UserRepositoryInterface } from '../../../domain/interfaces/UserRepositoryInterface';
import { generateSignature } from '../../../utility/password.utility';

export interface VerifyOtpLoginInput {
    userId: string;
    otpToken: string;
}

export interface VerifyOtpLoginOutput {
    user: {
        id: string;
        username: string;
        email: string;
        createdAt: Date;
    };
    token: string;
}

export class VerifyOtpLoginUseCase {
    constructor(private readonly userRepository: UserRepositoryInterface) { }

    async execute(input: VerifyOtpLoginInput): Promise<VerifyOtpLoginOutput> {
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.otp_secret || user.otp_enable !== 1) {
            throw new Error('OTP is not enabled for this user');
        }

        // Verify the OTP token
        const isValid = await otpVerify({
            token: input.otpToken,
            secret: user.otp_secret,
        });

        if (!isValid) {
            throw new Error('Invalid OTP code');
        }

        // Generate full JWT token
        const token = generateSignature({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        };
    }
}
