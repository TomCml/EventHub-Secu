import { UserRepositoryInterface } from '../../../domain/interfaces/UserRepositoryInterface';
import { IOtpBackupCodeRepository } from '../../../domain/interfaces/OtpBackupCodeRepositoryInterface';
import { generateSignature } from '../../../utility/password.utility';

export interface VerifyBackupCodeInput {
    userId: string;
    backupCode: string;
}

export interface VerifyBackupCodeOutput {
    user: {
        id: string;
        username: string;
        email: string;
        createdAt: Date;
    };
    token: string;
    remainingCodes: number;
}

export class VerifyBackupCodeUseCase {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly backupCodeRepository: IOtpBackupCodeRepository,
    ) { }

    async execute(input: VerifyBackupCodeInput): Promise<VerifyBackupCodeOutput> {
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp_enable !== 1) {
            throw new Error('OTP is not enabled for this user');
        }

        const backupCodeEntity = await this.backupCodeRepository.findByUserId(input.userId);
        if (!backupCodeEntity) {
            throw new Error('No backup codes found');
        }

        // Track consecutive failed tests
        const codes: string[] = JSON.parse(backupCodeEntity.props.codes);
        const codeIndex = codes.findIndex(
            (c) => c.toUpperCase() === input.backupCode.toUpperCase()
        );

        if (codeIndex === -1) {
            // Increment consecutive tests counter
            backupCodeEntity.props.nb_consecutive_tests += 1;
            await this.backupCodeRepository.update(backupCodeEntity);

            if (backupCodeEntity.props.nb_consecutive_tests >= 5) {
                throw new Error('Too many failed attempts. Account locked for backup codes.');
            }

            throw new Error('Invalid backup code');
        }

        // Remove used code
        codes.splice(codeIndex, 1);
        backupCodeEntity.props.codes = JSON.stringify(codes);
        backupCodeEntity.props.nb_code_used += 1;
        backupCodeEntity.props.nb_consecutive_tests = 0; // Reset on success
        await this.backupCodeRepository.update(backupCodeEntity);

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
            remainingCodes: codes.length,
        };
    }
}
