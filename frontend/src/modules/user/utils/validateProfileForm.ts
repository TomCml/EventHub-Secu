import type { UserProfile } from "../gateway/user.gateway";

//Utility function used in tests
export const validateProfileForm = (formData: Partial<UserProfile>) => {
        const errors: Record<string, string> = {};
        
        if (!formData.firstName?.trim()) {
            errors.firstName = "Le prénom est requis";
        }
        
        if (!formData.lastName?.trim()) {
            errors.lastName = "Le nom est requis";
        }
        
        if (!formData.email?.trim()) {
            errors.email = "L'email est requis";
        }

        const isFormValid = !!(
            formData.firstName?.trim() && 
            formData.lastName?.trim() && 
            formData.email?.trim()
        );

        return { errors, isFormValid };
    };
