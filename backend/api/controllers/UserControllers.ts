import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase, LoginUserUseCase } from '../../application/usecases';
import { UserRepositoryDatabase } from '../../infrastructure/repositories/UserRepositoryDatabase';
import { UserPayload } from '../../domain/entities/User';

// Instanciation du repository et des use cases
const userRepository = new UserRepositoryDatabase();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        const result = await registerUserUseCase.execute({
            username,
            email,
            password,
        });

        res.status(201).jsonSuccess(result);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const result = await loginUserUseCase.execute({
            email,
            password,
        });

        res.jsonSuccess(result);
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.user est défini par l'AuthMiddleware
        const user = (req as Request & { user?: UserPayload }).user;

        if (!user) {
            return res.status(401).jsonError('Not authenticated');
        }

        // Récupérer les données complètes de l'utilisateur (incluant otp_enable)
        const fullUser = await userRepository.findById(user.id);
        if (!fullUser) {
            return res.status(404).jsonError('User not found');
        }

        res.jsonSuccess({
            id: fullUser.id,
            username: fullUser.username,
            email: fullUser.email,
            otp_enable: fullUser.otp_enable,
            createdAt: fullUser.createdAt,
        });
    } catch (error) {
        next(error);
    }
};
