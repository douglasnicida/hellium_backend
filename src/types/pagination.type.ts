import { BaseReplySchema } from "./fastify.type";

// Pagination Params
export interface PaginationParams {
    page?: number;
    size?: number;
}

// Standard payload struct for pagination
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total?: number;
        page: number;
        size: number;
        maxPage: number;
    };
}

const PaginationRequestSchema = {
    type: 'object',
    properties: {
        page: { type: 'number'},
        size: { type: 'number'}
    }
}
const PaginationReplySchema = {
    200: {
        ...BaseReplySchema,
        properties: {
            ...BaseReplySchema.properties,
            payload: {
                type: 'object',
                properties: {
                    meta: {
                        type: 'object',
                        properties: {
                            total: { type: 'number' },
                            page: { type: 'number' },
                            size: { type: 'number' },
                            maxPage: { type: 'number' }
                        },
                        required: ['page', 'size', 'maxPage']
                    },
                    data: { type: 'array' }
                },
                required: ['data', 'meta']
            }
        }
    }
}
export const PaginationGetSchema = {
    schema: {
        query: PaginationRequestSchema,
        response: PaginationReplySchema
    }
}