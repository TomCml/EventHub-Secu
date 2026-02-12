import { describe, test, expect } from 'vitest';
import { validateRegisterForm } from '../utils/validateRegisterForm';

describe('useRegister - Password Validation', () => {
    
    describe('Password length validation', () => {
        test('should reject password shorter than 12 characters', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'Short1!abc',             // 10 characters
                confirmPassword: 'Short1!abc'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.password).toBeDefined();
        });

        test('should accept password with exactly 12 characters', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'ValidPass1!a',        // 12 characters with good criteria
                confirmPassword: 'ValidPass1!a'
            });
            
            expect(result.isFormValid).toBe(true);
            expect(result.errors.password).toBeUndefined();
        });

        test('should accept password longer than 12 characters', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'VeryLongPassword123!',  // > 12 characters
                confirmPassword: 'VeryLongPassword123!'
            });
            
            expect(result.isFormValid).toBe(true);
        });
    });

    describe('Password character requirements', () => {
        test('should reject password without uppercase letter', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'nouppercase1!a',         // No uppercase
                confirmPassword: 'nouppercase1!a'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.password).toBeDefined();
        });

        test('should reject password without lowercase letter', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'NOLOWERCASE1!A',          // No lowercase
                confirmPassword: 'NOLOWERCASE1!A'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.password).toBeDefined();
        });

        test('should reject password without digit', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'NoDigitHere!!a',            // No digit
                confirmPassword: 'NoDigitHere!!a'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.password).toBeDefined();
        });

        test('should reject password without special character', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'NoSpecialChar1a',            // No special character
                confirmPassword: 'NoSpecialChar1a'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.password).toBeDefined();
        });
    });

    describe('Password confirmation validation', () => {
        test('should reject when passwords do not match', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'ValidPass123!',
                confirmPassword: 'DifferentPass123!'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.confirmPassword).toBe("Les mots de passe ne correspondent pas.");
        });

        test('should accept when passwords match', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'ValidPass123!',
                confirmPassword: 'ValidPass123!'
            });
            
            expect(result.errors.confirmPassword).toBeUndefined();
        });
    });

    describe('Email validation', () => {
        test('should reject empty email', () => {
            const result = validateRegisterForm({
                email: '',
                password: 'ValidPass123!',
                confirmPassword: 'ValidPass123!'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.email).toBe("L'email est requis");
        });

        test('should accept non-empty email', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'ValidPass123!',
                confirmPassword: 'ValidPass123!'
            });
            
            expect(result.errors.email).toBeUndefined();
        });
    });

    describe('Form submission validation', () => {
        test('should disable submit when all fields are empty', () => {
            const result = validateRegisterForm({
                email: '',
                password: '',
                confirmPassword: ''
            });
            
            expect(result.isFormValid).toBe(false);
        });

        test('should disable submit when only email is filled', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: '',
                confirmPassword: ''
            });
            
            expect(result.isFormValid).toBe(false);
        });

        test('should enable submit when form is fully valid', () => {
            const result = validateRegisterForm({
                email: 'test@test.com',
                password: 'ValidPass123!',
                confirmPassword: 'ValidPass123!'
            });
            
            expect(result.isFormValid).toBe(true);
        });
    });
});
