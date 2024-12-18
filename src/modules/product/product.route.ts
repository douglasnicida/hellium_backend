import { Product, Recipe } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/prisma-client";
import { ProductService } from "./product.service";
import handleAuthenticate from "../../middlewares/authMiddleware";
import { CreatePostSchema, FindByIDGetSchema, UpdatePatchSchema } from "./product.schema";
import { ObjectId } from "mongodb";
import { objectIDValidation } from "../../middlewares/objectIdMiddleware";
import { CreateProductDTO } from "./dto/create-product.dto";
import { CustomReply, HttpCodes } from "../../types/fastify.type";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { handlePagination, PaginationRequest } from "../../middlewares/paginationMiddleware";
import { PaginationGetSchema } from "../../types/pagination.type";

export type FindByIDRequestParam = {
    Params: {
        id: ObjectId
    };
    Body: {}
}

export type CreateProductRequest = {
    Body: CreateProductDTO
} 

export type UpdateProductRequestParam = {
    Params: {
        id: ObjectId
    };
    Body: {
        name?: string;
        price?: number;
        stockQuantity?: number;
        Recipe?: Recipe;
    };
}

const productsRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const productService = new ProductService(prisma);

    // Garantindo que o middleware de autenticação esteja em todas as rotas de produto
    fastifyApp.addHook('preHandler', handleAuthenticate)

    fastifyApp.post('/', CreatePostSchema, async(req: FastifyRequest<CreateProductRequest>, res: FastifyReply) => {
        try {
            const resContent: CustomReply<Product> = await productService.create(req.body);

            return res.status(HttpCodes.CREATED).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message})
        }
    })

    // TODO: fazer paginação
    fastifyApp.get('/', {preHandler: handlePagination, schema: PaginationGetSchema.schema}, async(req: FastifyRequest<PaginationRequest>, res: FastifyReply) => {
        try {
            const resContent = await productService.findAll(req.pagination);

            return res.status(HttpCodes.OK).customSend(resContent);
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

    // tentar entender o porque que precisar inferir assim no começo
    fastifyApp.patch('/:id', {preValidation: objectIDValidation, schema: UpdatePatchSchema.schema}, async(req: FastifyRequest<UpdateProductRequestParam>, res: FastifyReply) => {
        try {
            const resContent = await productService.update(req.params.id, req.body);

            return res.status(HttpCodes.OK).customSend(resContent);
        } catch(err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    done();
}

export default productsRoute;