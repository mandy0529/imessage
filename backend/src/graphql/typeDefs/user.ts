import { ISODateString } from "next-auth";
import { CreateUsernameResponse } from "./../../utils/types";
import { gql } from "apollo-server-core";

const typeDefs = gql`
    type User {
        id: String
        name: String
        username: String
        email: String
        emailVerified: Boolean
        image: String
    }

    type Query {
        searchUsers(username: String): [User]
    }

    type Mutation {
        createUsername(username: String): CreateUserNameResponse
    }

    type CreateUserNameResponse {
        success: Boolean
        error: String
    }
`;

export default typeDefs;
