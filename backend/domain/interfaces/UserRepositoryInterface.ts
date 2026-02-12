import { User } from "../entities/User";

export interface UserRepositoryInterface {
    create(user: User): Promise<User>;

    login(email: string, password: string): Promise<User | null>;

    findById(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    delete(id: string): Promise<void>;

    update(id: string, user: User): Promise<User>;

    updateOtpFields(id: string, otpSecret: string | null, otpEnable: number): Promise<User>;
}
