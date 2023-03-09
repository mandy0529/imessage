import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";

import express from "express";
import http from "http";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import dotenv from "dotenv";
import { GraphQlContext, Session } from "./utils/types";

async function startApolloServer() {
    dotenv.config();

    // app setting
    const app = express();
    const httpServer = http.createServer(app);

    //  apollo schema
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    //  cors options
    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    };
    // context parameters later on

    //  prisma client
    const prisma = new PrismaClient();

    //  pub parameters later on

    // apollo server
    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",

        //  context parameter
        context: async ({ req, res }): Promise<GraphQlContext> => {
            const session = (await getSession({ req })) as Session;
            return { session, prisma };
        },

        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true })
        ]
    });

    // server start
    await server.start();
    server.applyMiddleware({
        app,
        cors: corsOptions
    });

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve)
    );

    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
}

startApolloServer().catch((error) => console.log(error));
