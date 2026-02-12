export const validateLoginForm = (formData: { email: string; password: string }) => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
        errors.email = "L'email est requis";
    }
    
    if (!formData.password) {
        errors.password = "Le mot de passe est requis";
    }

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

    return { errors, isFormValid };
};