/** 
 * Hook pour interagir avec l'API d'authentification
 *  Permet de se connecter, de s'inscrire et de récupérer les informations de l'utilisateur
*/

import { useApi } from "@/lib/api/useApi";
import type { User } from "@/stores/authStore";

//* DTO attendus par le backend */
export type LoginDto = { 
    email: string; 
    password: string 
};
export type SignupDto = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

//* Response attendu par le frontend */
type TokenResp = { access_token: string };

//* Hook pour interagir avec l'API d'authentification */
export function useAuthService() {
    const { post, get } = useApi();

    const login = (payload: LoginDto) => post<TokenResp>("/auth/login", payload);
    const signup = (payload: SignupDto) => post<TokenResp>("/auth/signup", payload);
    const me = () => get<User>("/users/me");

    return { login, signup, me };
};