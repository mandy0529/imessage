import { CreateUsernameResponse, GraphQlContext } from "./../../utils/types";
const resolvers = {
    Query: {
        searchUsers: () => {}
    },
    Mutation: {
        createUsername: async (
            _: any,
            args: { username: string },
            context: GraphQlContext
        ): Promise<CreateUsernameResponse> => {
            const { username } = args;
            const { session, prisma } = context;

            //  해당 유저가 아닐경우
            if (!session?.user) {
                return {
                    error: "Not Authorized"
                };
            }

            //  next-auth에서 나의 user 아이 꺼내기
            const { id: userId } = session.user;
            try {
                //  check that username is not taken
                const existingUser = await prisma.user.findUnique({
                    where: { username }
                });

                // 사용하려는 이름이 이미 사용하고 있을 때
                if (existingUser)
                    return {
                        error: "Username already taken. try another"
                    };

                // update user
                await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        username
                    }
                });

                return { success: true };
            } catch (error: any) {
                console.log("Create Username ", error);
                return {
                    error: error?.message
                };
            }
        }
    }
};

export default resolvers;
