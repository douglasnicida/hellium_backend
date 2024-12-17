import { ObjectId } from "mongodb";
import { NotFoundError } from "../handlers/errorHandler";
import { FastifyReply, FastifyRequest } from "fastify";
import { FindByIDRequestParam } from "../modules/product/product.route";

export async function objectIDValidation(req: FastifyRequest<FindByIDRequestParam>, res: FastifyReply) {
    // ObjectID precisa de 24 caracteres
    if (!ObjectId.isValid(req.params.id)) {
        throw NotFoundError('Invalid ID format');
    }
}