import Fastify from "fastify";
import { customReplyDecorator } from "./decorators/fastify-reply.decorator";
import { registerRoutes } from "./modules/routes";
import prismaPlugin from "./plugins/prisma.plugin";
import jwtPlugin from "./plugins/jwt.plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

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
        console.info(`Server listening on port ${Number(process.env.PORT)}`);
    } catch(err) {
        console.error(err)
        process.exit(1)
    }
}

start();

export default app;