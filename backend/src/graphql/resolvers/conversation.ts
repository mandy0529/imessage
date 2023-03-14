import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { GraphQlContext } from "./../../utils/types";

const resolvers = {
    Query: {
        conversation: async (_: any, __: any, context: GraphQlContext) => {
            const { session, prisma } = context;

            if (!session?.user) {
                throw new ApolloError("Not Authorized");
            }

            const {
                user: { id: userId }
            } = session;

            try {
            } catch (error: any) {
                console.log(error, "conversation error");
                throw new ApolloError(error?.message);
            }
        }
    },

    Mutation: {
        createConversation: async (
            _: any,
            args: { participantId: Array<string> },
            context: GraphQlContext
        ): Promise<{ conversationId: string }> => {
            const { participantId } = args;
            const { session, prisma } = context;

            //  user가 없을때 에러
            if (!session?.user) {
                throw new ApolloError("Not authorized");
            }

            //  session에서 나의 userId 꺼내기
            const {
                user: { id: userId }
            } = session;

            //  prisma conversation model에 create
            try {
                const conversation = await prisma.conversation.create({
                    data: {
                        // createConversation해줄때, conversation prisma model안에 conversationParticipant에도 같이 추가해줄 것
                        conversationParticipant: {
                            //  참가하는 id가 여러개이므로, createMany로 다 만들어줄것이고,
                            createMany: {
                                data: participantId.map((id) => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId
                                }))
                            }
                        }
                    },
                    //  validator로 로직 아래로 뺌
                    include: conversationPopulated
                });

                //  emit a CONVERSATION_CREATED event using pubsub

                return { conversationId: conversation.id };
            } catch (error) {
                console.log(error, "create conversation error");
                throw new ApolloError("Error creating conversation");
            }
        }
    }
};

export const participantPopulated =
    Prisma.validator<Prisma.ConversationParticipantInclude>()({
        //  참가하는 user의 정보 frontend를 위해 추가해주기
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
        //  latestMessage를 Message model에서 relation 해온것이므로 마지막 메세지가 무엇인지 누가보낸것인지 정보를 같이 들려줘야하기때문에 sender를 보내주자
        //  sender도 마찬가지로 user 정보가 들어있어야한다.
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
