import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppState } from '../../store/store';

const API_BASE = 'http://localhost:3000/api';

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    otp_enable: number;
    createdAt: string;
}

interface OtpSetupData {
    qrCodeDataUrl: string;
    manualKey: string;
}

interface OtpActivationResult {
    success: boolean;
    backupCodes: string[];
}

interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    // OTP setup state
    otpSetup: OtpSetupData | null;
    otpActivationResult: OtpActivationResult | null;
    isOtpLoading: boolean;
    otpError: string | null;
}

const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null,
    otpSetup: null,
    otpActivationResult: null,
    isOtpLoading: false,
    otpError: null,
};

// Fetch profile — appel réel vers le backend
export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { getState }) => {
        const state = getState() as AppState;
        const token = state.auth.token;

        const response = await fetch(`${API_BASE}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Erreur lors du chargement du profil');
        }

        return data.data as UserProfile;
    }
);

// Generate OTP secret + QR code
export const generateOtpSecret = createAsyncThunk(
    'user/generateOtpSecret',
    async (_, { getState }) => {
        const state = getState() as AppState;
        const token = state.auth.token;

        const response = await fetch(`${API_BASE}/otp/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Erreur lors de la génération OTP');
        }

        return data.data as OtpSetupData;
    }
);

// Verify OTP and activate 2FA
export const verifyAndActivateOtp = createAsyncThunk(
    'user/verifyAndActivateOtp',
    async (otpToken: string, { getState }) => {
        const state = getState() as AppState;
        const token = state.auth.token;

        const response = await fetch(`${API_BASE}/otp/verify-activation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otpToken }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Code OTP invalide');
        }

        return data.data as OtpActivationResult;
    }
);

// Disable OTP
export const disableOtp = createAsyncThunk(
    'user/disableOtp',
    async (_, { getState }) => {
        const state = getState() as AppState;
        const token = state.auth.token;

        const response = await fetch(`${API_BASE}/otp/disable`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error || data.message || 'Erreur lors de la désactivation');
        }

        return data.data;
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
        },
        clearOtpSetup: (state) => {
            state.otpSetup = null;
            state.otpActivationResult = null;
            state.otpError = null;
        },
        clearOtpError: (state) => {
            state.otpError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile 
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Erreur lors du chargement du profil";
            })
            // Generate OTP Secret
            .addCase(generateOtpSecret.pending, (state) => {
                state.isOtpLoading = true;
                state.otpError = null;
            })
            .addCase(generateOtpSecret.fulfilled, (state, action) => {
                state.isOtpLoading = false;
                state.otpSetup = action.payload;
            })
            .addCase(generateOtpSecret.rejected, (state, action) => {
                state.isOtpLoading = false;
                state.otpError = action.error.message || "Erreur OTP";
            })
            // Verify and Activate OTP
            .addCase(verifyAndActivateOtp.pending, (state) => {
                state.isOtpLoading = true;
                state.otpError = null;
            })
            .addCase(verifyAndActivateOtp.fulfilled, (state, action) => {
                state.isOtpLoading = false;
                state.otpActivationResult = action.payload;
                // Update profile OTP state
                if (state.profile) {
                    state.profile.otp_enable = 1;
                }
            })
            .addCase(verifyAndActivateOtp.rejected, (state, action) => {
                state.isOtpLoading = false;
                state.otpError = action.error.message || "Code OTP invalide";
            })
            // Disable OTP
            .addCase(disableOtp.pending, (state) => {
                state.isOtpLoading = true;
                state.otpError = null;
            })
            .addCase(disableOtp.fulfilled, (state) => {
                state.isOtpLoading = false;
                if (state.profile) {
                    state.profile.otp_enable = 0;
                }
                state.otpSetup = null;
                state.otpActivationResult = null;
            })
            .addCase(disableOtp.rejected, (state, action) => {
                state.isOtpLoading = false;
                state.otpError = action.error.message || "Erreur lors de la désactivation";
            });
    }
});

export const { clearProfile, clearOtpSetup, clearOtpError } = userSlice.actions;
export default userSlice.reducer;
