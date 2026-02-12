import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthMiddleware } from "../middlewares";
import {
    generateOtpSecret,
    verifyAndActivateOtp,
    verifyOtpLogin,
    verifyBackupCode,
    disableOtp,
} from "../controllers/OtpControllers";

const router = Router();

// Rate limiter pour les endpoints de vérification OTP (max 4 tentatives par minute)
const otpVerifyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 4,
    message: { success: false, error: 'Too many OTP attempts. Please try again in a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /otp/generate - Générer le secret OTP + QR code (authentifié)
router.post("/generate", AuthMiddleware, generateOtpSecret);

// POST /otp/verify-activation - Vérifier OTP et activer 2FA (authentifié)
router.post("/verify-activation", AuthMiddleware, otpVerifyLimiter, verifyAndActivateOtp);

// POST /otp/verify-login - Vérifier OTP lors du login (temp token)
router.post("/verify-login", otpVerifyLimiter, verifyOtpLogin);

// POST /otp/verify-backup - Utiliser un code de secours (temp token)
router.post("/verify-backup", otpVerifyLimiter, verifyBackupCode);

// POST /otp/disable - Désactiver le 2FA (authentifié)
router.post("/disable", AuthMiddleware, disableOtp);

export default router as Router;
