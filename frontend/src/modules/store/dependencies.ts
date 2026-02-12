import type { AuthGateway } from '../authentification/gateway/auth.gateway';
import type { UserGateway } from '../user/gateway/user.gateway';

//Dependencies injected into Redux thunks only for demo purposes, they are not used in this demonstration (would be in prod or "real" dev)
export type Dependencies = {
    authGateway: AuthGateway;
    userGateway: UserGateway;
};