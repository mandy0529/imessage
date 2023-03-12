import { gql } from "apollo-server-core";

const typeDefs = gql`
    type Mutation {
        createConversation(participantId: [String]): ConversationResponse
    }

    type ConversationResponse {
        conversationId: String
    }
`;

export default typeDefs;
