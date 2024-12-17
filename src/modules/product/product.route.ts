import { Product } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/prisma-client";
import { ProductService } from "./product.service";
import handleAuthenticate from "../../middlewares/authMiddleware";

const productsRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const productService = new ProductService(prisma);

    // Garantindo que o middleware de autenticação esteja em todas as rotas de produto
    fastifyApp.addHook('preHandler', handleAuthenticate)

    fastifyApp.get('/', async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const resContent = await productService.findAll();

            return res.status(200).customSend<Product[]>(resContent);
        } catch(err) {
            res.status(500).send({ error: 'Error to find products.' });
        }
    });

    done();
}

export default productsRoute;