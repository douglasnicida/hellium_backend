import Fastify from "fastify";
import { customReplyDecorator } from "./decorators/fastify-reply.decorator";
import { registerRoutes, registerSchemas } from "./modules";
import prismaPlugin from "./plugins/prisma.plugin";
import jwtPlugin from "./plugins/jwt.plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { HttpError } from "./handlers/errorHandler";

const app = Fastify({logger: false});

// Swagger
app.register(fastifySwagger, {
    openapi: {
        info: {
        title: 'API',
        description: 'Documentação da API',
        version: '1.0.0',
        },
    },
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

app.setErrorHandler((error, request, reply) => {
    // Se for um erro HttpError, usamos o statusCode e a mensagem do erro
    if (error instanceof HttpError) {
        reply.status(error.statusCode).send({
            error: error.name || 'Error',
            message: error.message || 'An error occurred.',
        });
    } else {
        reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Something went wrong on the server.',
        });
    }
});

// Schemas
await registerSchemas(app);

// Plugins
app.register(prismaPlugin);
app.register(jwtPlugin);

// Routes
app.register(registerRoutes);

// Decorators
customReplyDecorator(app);


const start = async () => {
    try {
        await app.listen({ port: Number(process.env.PORT) })
        console.warn(`Server listening on port ${Number(process.env.PORT)}`);
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}

start();

export default app;