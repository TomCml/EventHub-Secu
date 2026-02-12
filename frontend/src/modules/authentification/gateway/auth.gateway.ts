export interface AuthGateway {
    login(username: string, password: string): Promise<{ token: string }>;
    register(payload: any): Promise<{ id: string }>;
}