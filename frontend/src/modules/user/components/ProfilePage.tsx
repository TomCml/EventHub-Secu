import React from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Skeleton,
    Chip,
} from '@mui/material';
import { useProfile } from '../hooks/useProfile';
import { TwoFactorModal } from './TwoFactorModal';

export const ProfilePage: React.FC = () => {
    const {
        profile,
        isLoading,
        error,
        isOtpLoading,
        otpError,
        showTwoFactorModal,
        handleOpenTwoFactor,
        handleCloseTwoFactor,
    } = useProfile();

    // Displaying initial loading state
    if (isLoading) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Mon Profil
                </Typography>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} />
            </Box>
        );
    }

    return (
        <>
            <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Mon Profil
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                {profile && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Nom d'utilisateur</Typography>
                            <Typography variant="body1">{profile.username}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">Email</Typography>
                            <Typography variant="body1">{profile.email}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">Membre depuis</Typography>
                            <Typography variant="body1">
                                {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Section 2FA */}
                        <Typography variant="h6">Authentification à deux facteurs (2FA)</Typography>

                        {otpError && (
                            <Alert severity="error">{otpError}</Alert>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2">
                                Statut :
                            </Typography>
                            <Chip
                                label={profile.otp_enable === 1 ? 'Activé' : 'Désactivé'}
                                color={profile.otp_enable === 1 ? 'success' : 'default'}
                                size="small"
                            />
                        </Box>

                        {profile.otp_enable === 1 ? (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleOpenTwoFactor()}
                                disabled={isOtpLoading}
                            >
                                {isOtpLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Désactiver le 2FA'
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpenTwoFactor}
                            >
                                Activer le 2FA
                            </Button>
                        )}
                    </Box>
                )}
            </Paper>

            <TwoFactorModal
                open={showTwoFactorModal}
                onClose={handleCloseTwoFactor}
                mode={profile?.otp_enable === 1 ? 'deactivate' : 'activate'}
            />
        </>
    );
};
