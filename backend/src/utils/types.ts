import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export interface GraphQlContext {
    session: Session | null;
    prisma: PrismaClient;
    // pubsub
}

export interface CreateUsernameResponse {
    success?: boolean;
    error?: string;
}

//  user
export interface Session {
    user?: User;
    expires: ISODateString;
}

export interface User {
    id: string;
    username: string;
    email: string;
    image: string;
    name: string;
    emailVerfied: boolean;
}
