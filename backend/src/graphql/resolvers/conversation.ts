import { GraphQlContext } from "./../../utils/types";

const resolvers = {
    Mutation: {
        createConversation: async (
            _: any,
            args: { paticipantId: Array<string> },
            context: GraphQlContext
        ) => {
            console.log("INSEDE CREATE CONVERSATION", args);
        }
    }
};

export default resolvers;
