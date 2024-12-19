import { FastifyReply, FastifyRequest } from "fastify";
import { PaginationParams } from "../types/pagination.type";
import { BadRequestError } from "../handlers/errorHandler";

declare module 'fastify' {
    interface FastifyRequest {
        pagination?: {
            page: number;
            size: number;
            skip: number;
        };
    }
}

export interface PaginationRequest {
    Querystring: {
        page: number;
        size: number;
    }
}

export const handlePagination = async(req: FastifyRequest<PaginationRequest>, res: FastifyReply): Promise<any> => {
    const { page=1, size=15 } = req.query;

    if(page<1 || size<1) { throw BadRequestError('Page and size must be greater than 0') }

    req.pagination = {
        page: Math.floor(page) - 1,
        size: Math.floor(size),
        skip: (page-1) * size,
    }
}