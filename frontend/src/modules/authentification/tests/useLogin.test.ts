import { describe, test, expect } from 'vitest';
import { validateLoginForm } from "../utils/validateLoginForm"

describe('useLogin - Form Validation', () => {
    
    describe('Email validation', () => {
        test('should reject empty email', () => {
            const result = validateLoginForm({
                email: '',      //Empty email
                password: 'password123'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.email).toBe("L'email est requis");
        });

        test('should accept non-empty email', () => {
            const result = validateLoginForm({
                email: 'test@test.com',      //Non empty email = valid
                password: 'password123'
            });
            
            expect(result.errors.email).toBeUndefined();
        });
    });

    describe('Password validation', () => {
        test('should reject empty password', () => {
            const result = validateLoginForm({
                email: 'test@test.com',      
                password: ''                 //Empty password
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.password).toBe("Le mot de passe est requis");
        });

        test('should accept any non-empty password', () => {
            const result = validateLoginForm({
                email: 'test@test.com',
                password: 'any-password'
            });
            
            expect(result.errors.password).toBeUndefined();
        });
    });

    describe('Form submission validation', () => {
        test('should disable submit when all fields are empty', () => {
            const result = validateLoginForm({
                email: '',
                password: ''
            });
            
            expect(result.isFormValid).toBe(false);
        });

        test('should disable submit when only email is filled', () => {
            const result = validateLoginForm({
                email: 'test@test.com',
                password: ''
            });
            
            expect(result.isFormValid).toBe(false);
        });

        test('should disable submit when only password is filled', () => {
            const result = validateLoginForm({
                email: '',
                password: 'password123'
            });
            
            expect(result.isFormValid).toBe(false);
        });

        test('should enable submit when both fields are filled', () => {
            const result = validateLoginForm({
                email: 'test@test.com',
                password: 'password123'
            });
            
            expect(result.isFormValid).toBe(true);
        });

        test('should reject whitespace-only values', () => {
            const result = validateLoginForm({
                email: '   ',
                password: '   '
            });
            
            expect(result.isFormValid).toBe(false);
        });
    });
});
