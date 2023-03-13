import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { GraphQlContext } from "./../../utils/types";

const resolvers = {
    Mutation: {
        createConversation: async (
            _: any,
            args: { participantId: Array<string> },
            context: GraphQlContext
        ) => {
            const { participantId } = args;
            const { session, prisma } = context;

            //  user가 없을때 에러
            if (!session?.user) {
                throw new ApolloError("Not authorized");
            }

            const {
                user: { id: userId }
            } = session;

            try {
                const conversation = await prisma.conversation.create({
                    data: {
                        conversationParticipant: {
                            createMany: {
                                data: participantId.map((id) => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId
                                }))
                            }
                        }
                    },
                    include: conversationPopulated
                });
            } catch (error) {
                console.log(error, "create conversation error");
                throw new ApolloError("Error creating conversation");
            }
        }
    }
};

export const participantPopulated =
    Prisma.validator<Prisma.ConversationParticipantInclude>()({
        user: {
            select: {
                id: true,
                username: true
            }
        }
    });

export const conversationPopulated =
    Prisma.validator<Prisma.ConversationInclude>()({
        conversationParticipant: {
            include: participantPopulated
        },
        latestMessage: {
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        }
    });
export default resolvers;
