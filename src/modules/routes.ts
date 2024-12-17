import { FastifyInstance, FastifyPluginCallback } from "fastify";
import authRoute from "./auth/auth.route";
import productsRoute from "./product/product.route";

// Routes
export const registerRoutes: FastifyPluginCallback = (fastifyApp: FastifyInstance, opts, done) => {
    fastifyApp.register(authRoute, {prefix: '/auth'});
    fastifyApp.register(productsRoute, {prefix: '/products'});
    
    done();
}

