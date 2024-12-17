import { Product } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/prisma-client";
import { ProductService } from "./product.service";
import handleAuthenticate from "../../middlewares/authMiddleware";
import { CreateProductPostSchema, FindByIDGetSchema } from "./product.schema";
import { ObjectId } from "mongodb";
import { objectIDValidation } from "../../middlewares/objectIdMiddleware";
import { CreateProductDTO } from "./dto/createProductDTO";
import { HttpError } from "../../handlers/errorHandler";
import { CustomReply, HttpCodes } from "../../types/fastify.type";

export interface FindByIDRequestParam {
    Params: {
        id: ObjectId
    }
}

export interface CreateProductRequest {
    Body: CreateProductDTO
} 

const productsRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const productService = new ProductService(prisma);

    // Garantindo que o middleware de autenticação esteja em todas as rotas de produto
    fastifyApp.addHook('preHandler', handleAuthenticate)

    fastifyApp.post('/', CreateProductPostSchema, async(req: FastifyRequest<CreateProductRequest>, res: FastifyReply) => {
        try {
            const resContent: CustomReply<Product> = await productService.create(req.body);

            return res.status(HttpCodes.CREATED).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message})
        }
    })

    // TODO: fazer paginação
    fastifyApp.get('/', async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const resContent = await productService.findAll();

            return res.status(HttpCodes.OK).customSend<Product[]>(resContent);
        } catch(err) {
            res.status(err.statusCode).customSend({ message: 'Error to find products.' });
        }
    });

    fastifyApp.get('/:id', {preValidation: objectIDValidation, schema: FindByIDGetSchema.schema}, async(req: FastifyRequest<FindByIDRequestParam>, res: FastifyReply) => {
        try {
            const resContent = await productService.findByID(req.params.id);
            return res.status(HttpCodes.OK).customSend<Product>(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    });

    done();
}

export default productsRoute;