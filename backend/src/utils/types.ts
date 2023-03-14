import {
    conversationPopulated,
    participantPopulated
} from "./../graphql/resolvers/conversation";
import { Prisma, PrismaClient } from "@prisma/client";
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
}

/* conversation */
export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
    include: typeof participantPopulated;
}>;
