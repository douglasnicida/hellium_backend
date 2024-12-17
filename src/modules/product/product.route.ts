import { Product } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/prisma-client";
import { ProductService } from "./product.service";
import handleAuthenticate from "../../middlewares/authMiddleware";
import { FindByIDGetSchema } from "./product.schema";
import { ObjectId } from "mongodb";
import { objectIDValidation } from "../../middlewares/objectIdMiddleware";

export interface FindByIDRequestParam {
    Params: {
        id: ObjectId
    }
}

const productsRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const productService = new ProductService(prisma);

    // Garantindo que o middleware de autenticação esteja em todas as rotas de produto
    fastifyApp.addHook('preHandler', handleAuthenticate)

    fastifyApp.get('/', async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const resContent = await productService.findAll();

            return res.status(200).customSend<Product[]>(resContent);
        } catch(err) {
            res.status(err.statusCode).customSend({ message: 'Error to find products.' });
        }
    });

    fastifyApp.get('/:id', {preValidation: objectIDValidation, schema: FindByIDGetSchema.schema}, async(req: FastifyRequest<FindByIDRequestParam>, res: FastifyReply) => {
        try {
            const resContent = await productService.findByID(req.params.id);
            return res.status(200).customSend<Product>(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    });

    done();
}

export default productsRoute;