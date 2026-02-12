const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

//Utility function that could be in a seperated file 
export const validateRegisterForm = (formData: { email: string; password: string; confirmPassword: string }) => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
        errors.email = "L'email est requis";
    }
    
    if (!PASSWORD_REGEX.test(formData.password)) {
        errors.password = "Le mot de passe doit faire 12 caractères, inclure Maj, Min, Chiffre et Caractère spécial.";
    }
    
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    const hasErrors = Object.keys(errors).length > 0;
    const isFilled = Object.values(formData).every(val => val !== '');
    const isFormValid = !hasErrors && isFilled;

    return { errors, isFormValid };
};