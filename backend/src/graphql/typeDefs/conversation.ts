import { User } from "@prisma/client";
import { ISODateString } from "next-auth";
import { gql } from "apollo-server-core";

const typeDefs = gql`
    scalar Date

    type Mutation {
        createConversation(participantId: [String]): CreateConversationResponse
    }

    type CreateConversationResponse {
        conversationId: String
    }

    type Conversation {
        id: String
        # latestMessage: Message
        participants: [ConversationParticipant]
        createdAt: Date
        updateAt: Date
    }

    type ConversationParticipant {
        id: String
        user: User
        hasSeenLatestMessage: Boolean
    }

    type Query {
        conversation: [Conversation]
    }
`;

export default typeDefs;
