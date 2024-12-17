import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifyJwt from "@fastify/jwt";

// Registering the plugin with secret key for JWT
const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });
};

export default fp(jwtPlugin);