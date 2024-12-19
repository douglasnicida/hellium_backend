import { ObjectId } from "mongodb";
import { BadRequestError } from "../handlers/errorHandler";
import { FastifyReply, FastifyRequest } from "fastify";
import { FindByIDRequestParam } from "../modules/product/product.route";

export async function objectIDValidation(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as FindByIDRequestParam['Params'];
    
    // ObjectID precisa de 24 caracteres
    if (!ObjectId.isValid(id)) {
        throw BadRequestError('Invalid ID format');
    }
}