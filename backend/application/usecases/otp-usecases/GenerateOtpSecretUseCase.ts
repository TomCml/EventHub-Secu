import { generateSecret, generateURI } from 'otplib';
import * as QRCode from 'qrcode';
import { UserRepositoryInterface } from '../../../domain/interfaces/UserRepositoryInterface';

export interface GenerateOtpSecretInput {
    userId: string;
}

export interface GenerateOtpSecretOutput {
    qrCodeDataUrl: string;
    manualKey: string;
}

export class GenerateOtpSecretUseCase {
    constructor(private readonly userRepository: UserRepositoryInterface) { }

    async execute(input: GenerateOtpSecretInput): Promise<GenerateOtpSecretOutput> {
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Generate a new TOTP secret
        const secret = generateSecret();

        // Save secret to user (not yet enabled)
        await this.userRepository.updateOtpFields(input.userId, secret, user.otp_enable);

        // Generate QR code for authenticator apps
        const otpAuthUrl = generateURI({
            issuer: 'EventHub',
            label: user.email,
            secret,
        });

        const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

        return {
            qrCodeDataUrl,
            manualKey: secret,
        };
    }
}
