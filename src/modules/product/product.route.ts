import { Product, Recipe } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/prisma-client";
import { ProductService } from "./product.service";
import handleAuthenticate from "../../middlewares/authMiddleware";
import { CreatePostSchema, FindByIDGetSchema, UpdatePatchSchema } from "./product.schema";
import { ObjectId } from "mongodb";
import { objectIDValidation } from "../../middlewares/objectIdMiddleware";
import { CreateProductDTO } from "./dto/create-product.dto";
import { CustomReply, FindByIDRequestParam, HttpCodes } from "../../types/fastify.type";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { handlePagination, PaginationRequest } from "../../middlewares/paginationMiddleware";
import { PaginatedResponse, PaginationGetSchema } from "../../types/pagination.type";


export type UpdateProductRequestParam = {
    Params: FindByIDRequestParam['Params'];
    Body: UpdateProductDTO;
}

const productsRoute = (fastifyApp: FastifyInstance, opts, done) => {
    const productService = new ProductService(prisma);

    // Garantindo que o middleware de autenticação esteja em todas as rotas de produto
    fastifyApp.addHook('preHandler', handleAuthenticate)

    // Create
    fastifyApp.post('/', CreatePostSchema, async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const body = req.body as CreateProductDTO;
            const createdProduct = await productService.create(body);

            const resContent: CustomReply<Product> = {
                message: `Product ${createdProduct.name} created successfully.`,
                payload: createdProduct
            }

            return res.status(HttpCodes.CREATED).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message})
        }
    })

    // Find All
    fastifyApp.get('/', {preHandler: handlePagination, schema: PaginationGetSchema.schema}, async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const paginatedContent = await productService.findAll(req.pagination);

            const resContent: CustomReply<PaginatedResponse<Product>> = {
                payload: paginatedContent,
            }

            return res.status(HttpCodes.OK).customSend(resContent);
        } catch(err) {
            res.status(err.statusCode).customSend({ message: 'Error to find products.' });
        }
    });

    // Find by ID
    fastifyApp.get('/:id', {preValidation: objectIDValidation, schema: FindByIDGetSchema.schema}, async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const { id } = req.params as FindByIDRequestParam['Params'];
            const product = await productService.findByID(id);

            const resContent: CustomReply<Product> = {
                payload: product,
            }

            return res.status(HttpCodes.OK).customSend(resContent);
        } catch (err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    });

    // Update
    fastifyApp.patch('/:id', {preValidation: objectIDValidation, schema: UpdatePatchSchema.schema}, async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const { id } = req.params as UpdateProductRequestParam['Params'];
            const body = req.body as UpdateProductRequestParam['Body'];

            const updatedProduct = await productService.update(id, body);

            const resContent: CustomReply<Product> = {
                message: `Product ${updatedProduct.name} updated successfully.`,
                payload: updatedProduct
            }

            return res.status(HttpCodes.OK).customSend(resContent);
        } catch(err) {
            return res.status(err.statusCode).customSend({message: err.message});
        }
    })

    done();
}

export default productsRoute;