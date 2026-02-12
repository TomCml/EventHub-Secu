import { describe, test, expect } from 'vitest';
import { validateProfileForm } from '../utils/validateProfileForm';

describe('useProfile - Form Validation', () => {
    
    describe('Required fields validation', () => {
        test('should reject empty firstName', () => {
            const result = validateProfileForm({
                firstName: '',
                lastName: 'Doe',
                email: 'john@test.com'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.firstName).toBe("Le prénom est requis");
        });

        test('should reject empty lastName', () => {
            const result = validateProfileForm({
                firstName: 'John',
                lastName: '',
                email: 'john@test.com'
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.lastName).toBe("Le nom est requis");
        });

        test('should reject empty email', () => {
            const result = validateProfileForm({
                firstName: 'John',
                lastName: 'Doe',
                email: ''
            });
            
            expect(result.isFormValid).toBe(false);
            expect(result.errors.email).toBe("L'email est requis");
        });
    });

    describe('Form update validation', () => {
        test('should enable update when all required fields are filled', () => {
            const result = validateProfileForm({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com'
            });
            
            expect(result.isFormValid).toBe(true);
            expect(Object.keys(result.errors).length).toBe(0);
        });

        test('should disable update when form is incomplete', () => {
            const result = validateProfileForm({
                firstName: 'John',
                lastName: '',
                email: 'john@test.com'
            });
            
            expect(result.isFormValid).toBe(false);
        });
    });
});
