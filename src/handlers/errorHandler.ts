import { HttpCodes } from "../types/fastify.type";

// Classe para erro customizado com statusCode
export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: HttpCodes) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

// Função para criar erros customizados
function createHttpError(message: string, statusCode: HttpCodes) {
    return new HttpError(message, statusCode);
}

export const ConflictError = (message = 'Conflict error.') =>
    createHttpError(message, HttpCodes.CONFLICT);

export const BadRequestError = (message = 'Bad request.') =>
    createHttpError(message, HttpCodes.BAD_REQUEST);

export const UnauthorizedError = (message = 'Unauthorized access.') =>
    createHttpError(message, HttpCodes.UNAUTHORIZED);

export const ForbiddenError = (message = 'Forbidden access.') =>
    createHttpError(message, HttpCodes.FORBIDDEN);

export const NotFoundError = (message = 'Resource not found.') =>
    createHttpError(message, HttpCodes.NOT_FOUND);

export const InternalServerError = (message = 'Internal Server Error.') =>
    createHttpError(message, HttpCodes.INTERNAL_SERVER_ERROR);
