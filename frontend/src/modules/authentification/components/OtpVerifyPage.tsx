import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Link as MuiLink,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import type { AppState } from '../../store/store';
import { verifyOtpLogin, verifyBackupCode, clearError } from '../store/auth.slice';

export const OtpVerifyPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, tempToken, token } = useSelector((state: AppState) => state.auth);

    const [otpCode, setOtpCode] = useState('');
    const [backupMode, setBackupMode] = useState(false);
    const [backupCodeValue, setBackupCodeValue] = useState('');

    // Redirect if already authenticated
    React.useEffect(() => {
        if (token) {
            navigate('/profile');
        }
    }, [token, navigate]);

    // Redirect if no tempToken (user didn't go through login)
    React.useEffect(() => {
        if (!tempToken) {
            navigate('/login');
        }
    }, [tempToken, navigate]);

    const handleOtpSubmit = async () => {
        if (!tempToken || !otpCode) return;
        dispatch(clearError());
        try {
            await dispatch(verifyOtpLogin({ tempToken, otpToken: otpCode })).unwrap();
        } catch {
            // Error handled by Redux
        }
    };

    const handleBackupSubmit = async () => {
        if (!tempToken || !backupCodeValue) return;
        dispatch(clearError());
        try {
            await dispatch(verifyBackupCode({ tempToken, backupCode: backupCodeValue })).unwrap();
        } catch {
            // Error handled by Redux
        }
    };

    const toggleBackupMode = () => {
        setBackupMode(!backupMode);
        dispatch(clearError());
    };

    return (
        <Paper sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Vérification en deux étapes
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {!backupMode ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Entrez le code à 6 chiffres de votre application authenticator.
                    </Typography>
                    <TextField
                        label="Code OTP"
                        variant="outlined"
                        fullWidth
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        disabled={isLoading}
                        inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                        placeholder="000000"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={otpCode.length !== 6 || isLoading}
                        onClick={handleOtpSubmit}
                        sx={{ position: 'relative' }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Vérifier'
                        )}
                    </Button>
                    <MuiLink
                        component="button"
                        variant="body2"
                        onClick={toggleBackupMode}
                        sx={{ mt: 1, textAlign: 'center' }}
                    >
                        Utiliser un code de secours
                    </MuiLink>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Entrez un de vos codes de secours.
                    </Typography>
                    <TextField
                        label="Code de secours"
                        variant="outlined"
                        fullWidth
                        value={backupCodeValue}
                        onChange={(e) => setBackupCodeValue(e.target.value.toUpperCase())}
                        disabled={isLoading}
                        placeholder="ABCD1234"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!backupCodeValue.trim() || isLoading}
                        onClick={handleBackupSubmit}
                        sx={{ position: 'relative' }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Vérifier le code de secours'
                        )}
                    </Button>
                    <MuiLink
                        component="button"
                        variant="body2"
                        onClick={toggleBackupMode}
                        sx={{ mt: 1, textAlign: 'center' }}
                    >
                        Utiliser le code OTP
                    </MuiLink>
                </Box>
            )}
        </Paper>
    );
};
