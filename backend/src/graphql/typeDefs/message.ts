import { gql } from "apollo-server-core";

const typeDefs = gql`
    type Message {
        id: String
        body: String
        createdAt: Date
        sender: User
    }
`;
export default typeDefs;
