import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    Alert,
    CircularProgress,
    Divider,
    Chip,
} from '@mui/material';
import { useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import type { AppState } from '../../store/store';
import { generateOtpSecret, verifyAndActivateOtp, clearOtpSetup, clearOtpError, disableOtp } from '../store/user.slice';

interface TwoFactorModalProps {
    open: boolean;
    onClose: () => void;
    mode: 'activate' | 'deactivate';  // ← nouveau
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ open, onClose, mode }) => {
    const dispatch = useAppDispatch();
    const { otpSetup, otpActivationResult, isOtpLoading, otpError } = useSelector(
        (state: AppState) => state.user
    );

    const [otpCode, setOtpCode] = useState('');

    const handleGenerate = () => {
        dispatch(generateOtpSecret());
    };

    const handleVerify = async () => {
        if (!otpCode) return;
        try {
            await dispatch(verifyAndActivateOtp(otpCode)).unwrap();
        } catch {
            // Error handled by Redux
        }
    };
    const handleDeactivate = async () => {
        try {
            await dispatch(disableOtp()).unwrap();
            onClose();
        } catch {
            // Error handled by Redux
        }
    };

    const handleClose = () => {
        dispatch(clearOtpSetup());
        dispatch(clearOtpError());
        setOtpCode('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Activer l'authentification à deux facteurs (2FA)</DialogTitle>
            <DialogContent>
                {otpError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{otpError}</Alert>
                )}

                {/* Step 1: Generate the QR code */}
                {mode === 'activate' && !otpSetup && !otpActivationResult && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Cliquez sur le bouton ci-dessous pour générer un QR code.
                            Scannez-le ensuite avec votre application authenticator (Google Authenticator, Authy, etc.).
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleGenerate}
                            disabled={isOtpLoading}
                            sx={{ mt: 2 }}
                        >
                            {isOtpLoading ? <CircularProgress size={24} /> : 'Générer le QR code'}
                        </Button>
                    </Box>
                )}

                {/* Step 2: Show QR code + manual key + verify */}
                {mode === 'activate' && otpSetup && !otpActivationResult && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Scannez ce QR code avec votre application authenticator :
                        </Typography>
                        <Box
                            component="img"
                            src={otpSetup.qrCodeDataUrl}
                            alt="QR Code OTP"
                            sx={{ width: 200, height: 200, border: '1px solid #eee', borderRadius: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Ou entrez cette clé manuellement :
                        </Typography>
                        <Chip
                            label={otpSetup.manualKey}
                            variant="outlined"
                            sx={{ fontFamily: 'monospace', letterSpacing: 1 }}
                        />
                        <Divider sx={{ width: '100%', my: 1 }} />
                        <Typography variant="body2">
                            Entrez le code à 6 chiffres affiché dans votre app :
                        </Typography>
                        <TextField
                            label="Code OTP"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                            placeholder="000000"
                            disabled={isOtpLoading}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleVerify}
                            disabled={otpCode.length !== 6 || isOtpLoading}
                        >
                            {isOtpLoading ? <CircularProgress size={24} /> : 'Activer le 2FA'}
                        </Button>
                    </Box>
                )}

                {/* Step 3: Show backup codes */}
                {otpActivationResult && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Alert severity="success">
                            L'authentification à deux facteurs est activée !
                        </Alert>
                        <Typography variant="body1" fontWeight="bold">
                            Codes de secours
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Conservez ces codes en lieu sûr. Ils vous permettront de vous connecter si vous perdez l'accès à votre application authenticator. <br />
                        </Typography>
                        <Alert severity="warning">
                            Chaque code est unique et ne peut être utilisé qu'une seule fois.
                        </Alert>
                        <Alert severity="error">
                            Ces codes ne seront plus affichés. Notez-les maintenant !
                            <br />
                            Nous vous recommandons de les stocker dans plusieurs endroits différents.
                        </Alert>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 1,
                                p: 2,
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                            }}
                        >
                            {otpActivationResult.backupCodes.map((code, i) => (
                                <Typography
                                    key={i}
                                    variant="body2"
                                    sx={{ fontFamily: 'monospace', textAlign: 'center' }}
                                >
                                    {code}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Optional step : Ask confirmation before deactivating 2FA */}
                {mode === 'deactivate' && !otpActivationResult && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Alert severity="warning">
                            Attention ! Votre compte sera moins sécurisé sans 2FA.
                            <br />
                            Voulez-vous vraiment désactiver l'authentification à deux facteurs ?
                        </Alert>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeactivate}
                            disabled={isOtpLoading}
                        >
                            {isOtpLoading ? <CircularProgress size={24} /> : 'Désactiver le 2FA'}
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};
