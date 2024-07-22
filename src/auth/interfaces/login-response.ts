import { User } from "../entities/user.entity";

export interface LogInResponse {
    user: User;
    token: string;
}