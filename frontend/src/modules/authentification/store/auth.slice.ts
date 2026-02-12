import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:3000/api';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    error: string | null;
    // OTP state
    otpRequired: boolean;
    tempToken: string | null;
}

interface LoginResponse {
    token: string;
    otpRequired?: boolean;
    tempToken?: string;
    user: {
        id: string;
        username: string;
        email: string;
        createdAt: string;
    };
}

interface RegisterResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        createdAt: string;
    };
}

const initialState: AuthState = {
    token: null,
    isLoading: false,
    error: null,
    otpRequired: false,
    tempToken: null,
};

// Login thunk — appel réel vers le backend
export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload: { email: string; password: string }) => {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Identifiants invalides');
        }

        return data.data as LoginResponse;
    }
);

// Register thunk — appel réel vers le backend
export const registerUser = createAsyncThunk(
    'auth/register',
    async (payload: { username: string; email: string; password: string }) => {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || "Erreur lors de l'inscription");
        }

        return data.data as RegisterResponse;
    }
);

// OTP login verification thunk
export const verifyOtpLogin = createAsyncThunk(
    'auth/verifyOtpLogin',
    async (payload: { tempToken: string; otpToken: string }) => {
        const response = await fetch(`${API_BASE}/otp/verify-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Code OTP invalide');
        }

        return data.data as LoginResponse;
    }
);

// Backup code verification thunk
export const verifyBackupCode = createAsyncThunk(
    'auth/verifyBackupCode',
    async (payload: { tempToken: string; backupCode: string }) => {
        const response = await fetch(`${API_BASE}/otp/verify-backup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Code de secours invalide');
        }

        return data.data as LoginResponse;
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.otpRequired = false;
            state.tempToken = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.otpRequired) {
                    state.otpRequired = true;
                    state.tempToken = action.payload.tempToken || null;
                } else {
                    state.token = action.payload.token;
                    state.otpRequired = false;
                    state.tempToken = null;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Erreur inconnue";
            })
            // Register
            .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Erreur inconnue";
            })
            // OTP Login Verification
            .addCase(verifyOtpLogin.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(verifyOtpLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.otpRequired = false;
                state.tempToken = null;
            })
            .addCase(verifyOtpLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Code OTP invalide";
            })
            // Backup Code Verification
            .addCase(verifyBackupCode.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(verifyBackupCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.otpRequired = false;
                state.tempToken = null;
            })
            .addCase(verifyBackupCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Code de secours invalide";
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;