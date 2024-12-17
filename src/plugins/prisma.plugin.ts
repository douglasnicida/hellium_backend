import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { prisma } from "../database/prisma-client";
import fp from "fastify-plugin";

const prismaPlugin = fp(async (fastifyApp: FastifyInstance) => {
    try {
        await prisma.$connect();
        // fastifyApp.decorate('prisma', prisma);
    } catch (error) {
        fastifyApp.log.error(error);
        throw new Error('Failed to connect to database');
    }

    // Defining a hook to close the database connection when the server is shutting down
    fastifyApp.addHook('onClose', (instance: FastifyInstance, done: HookHandlerDoneFunction) => {
        prisma.$disconnect()
            .then(() => done())
            .catch(err => {
                instance.log.error(err, 'Error disconnecting from database');
                done();
            });
    });
}, {name: 'prisma'});

export default prismaPlugin;