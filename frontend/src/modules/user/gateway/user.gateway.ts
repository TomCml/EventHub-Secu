export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    createdAt: string;
}

export interface UserGateway {
    getProfile(): Promise<UserProfile>;
    updateProfile(data: Partial<UserProfile>): Promise<UserProfile>;
}
