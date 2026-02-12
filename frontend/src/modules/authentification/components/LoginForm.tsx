import React from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export const LoginForm: React.FC = () => {
    const { formData, errors, isLoading, authError, isFormValid, handleChange, handleSubmit } = useLogin();

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Connexion
            </Typography>

            {authError && (
                <Alert severity="error">{authError}</Alert>
            )}

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
                    'Se connecter'
                )}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                Pas encore de compte ?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    S'inscrire
                </Link>
            </Typography>
        </Box>
    );
};
