import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnvVariable } from '../../utility/index';
import {
    GenerateOtpSecretUseCase,
    VerifyAndActivateOtpUseCase,
    VerifyOtpLoginUseCase,
    VerifyBackupCodeUseCase,
    DisableOtpUseCase,
} from '../../application/usecases';
import { UserRepositoryDatabase } from '../../infrastructure/repositories/UserRepositoryDatabase';
import { OtpBackupCodeRepositoryDatabase } from '../../infrastructure/repositories/OtpBackupCodeRepositoryDatabase';
import { UserPayload } from '../../domain/entities/User';

// Instanciation des repositories et des use cases
const userRepository = new UserRepositoryDatabase();
const backupCodeRepository = new OtpBackupCodeRepositoryDatabase();

const generateOtpSecretUseCase = new GenerateOtpSecretUseCase(userRepository);
const verifyAndActivateOtpUseCase = new VerifyAndActivateOtpUseCase(userRepository, backupCodeRepository);
const verifyOtpLoginUseCase = new VerifyOtpLoginUseCase(userRepository);
const verifyBackupCodeUseCase = new VerifyBackupCodeUseCase(userRepository, backupCodeRepository);
const disableOtpUseCase = new DisableOtpUseCase(userRepository, backupCodeRepository);

// POST /otp/generate — Génère un secret OTP + QR code (auth requise)
export const generateOtpSecret = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: UserPayload }).user;
        if (!user) {
            return res.status(401).jsonError('Not authenticated');
        }

        const result = await generateOtpSecretUseCase.execute({ userId: user.id });
        res.jsonSuccess(result);
    } catch (error) {
        next(error);
    }
};

// POST /otp/verify-activation — Vérifie l'OTP et active le 2FA (auth requise)
export const verifyAndActivateOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: UserPayload }).user;
        if (!user) {
            return res.status(401).jsonError('Not authenticated');
        }

        const { otpToken } = req.body;
        if (!otpToken) {
            return res.status(400).jsonError('OTP token is required');
        }

        const result = await verifyAndActivateOtpUseCase.execute({
            userId: user.id,
            otpToken,
        });
        res.jsonSuccess(result);
    } catch (error) {
        next(error);
    }
};

// POST /otp/verify-login — Vérifie l'OTP lors du login (temp token requis)
export const verifyOtpLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tempToken, otpToken } = req.body;

        if (!tempToken || !otpToken) {
            return res.status(400).jsonError('tempToken and otpToken are required');
        }

        // Verify and decode the temp token
        const SECRET_KEY = getEnvVariable("JWT_SECRET");
        const decoded = jwt.verify(tempToken, SECRET_KEY) as { id: string; purpose: string };

        if (decoded.purpose !== 'otp-verification') {
            return res.status(401).jsonError('Invalid temp token');
        }

        const result = await verifyOtpLoginUseCase.execute({
            userId: decoded.id,
            otpToken,
        });
        res.jsonSuccess(result);
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).jsonError('Temp token expired. Please login again.');
        }
        next(error);
    }
};

// POST /otp/verify-backup — Utilise un code de secours (temp token requis)
export const verifyBackupCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tempToken, backupCode } = req.body;

        if (!tempToken || !backupCode) {
            return res.status(400).jsonError('tempToken and backupCode are required');
        }

        // Verify and decode the temp token
        const SECRET_KEY = getEnvVariable("JWT_SECRET");
        const decoded = jwt.verify(tempToken, SECRET_KEY) as { id: string; purpose: string };

        if (decoded.purpose !== 'otp-verification') {
            return res.status(401).jsonError('Invalid temp token');
        }

        const result = await verifyBackupCodeUseCase.execute({
            userId: decoded.id,
            backupCode,
        });
        res.jsonSuccess(result);
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).jsonError('Temp token expired. Please login again.');
        }
        next(error);
    }
};

// POST /otp/disable — Désactive le 2FA (auth requise)
export const disableOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: UserPayload }).user;
        if (!user) {
            return res.status(401).jsonError('Not authenticated');
        }

        const result = await disableOtpUseCase.execute({ userId: user.id });
        res.jsonSuccess(result);
    } catch (error) {
        next(error);
    }
};
