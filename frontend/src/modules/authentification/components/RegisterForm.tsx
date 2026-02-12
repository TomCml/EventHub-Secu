import React from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm: React.FC = () => {
    const { formData, errors, isFormValid, isLoading, authError, isSuccess, handleChange, handleSubmit } = useRegister();

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Inscription
            </Typography>

            {authError && (
                <Alert severity="error">{authError}</Alert>
            )}

            {isSuccess && (
                <Alert severity="success">
                    Inscription réussie ! Redirection...
                </Alert>
            )}

            <TextField
                label="Nom d'utilisateur"
                variant="outlined"
                fullWidth
                value={formData.username}
                onChange={handleChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isLoading}
            />

            <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
            />

            <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
            />

            <TextField
                label="Confirmer mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
            />

            <Button
                variant="contained"
                color="primary"
                disabled={!isFormValid || isLoading}
                onClick={handleSubmit}
                sx={{ position: 'relative' }}
            >
                {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "S'inscrire"
                )}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                Déjà un compte ?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    Se connecter
                </Link>
            </Typography>
        </Box>
    );
};