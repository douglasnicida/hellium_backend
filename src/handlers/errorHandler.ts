// Classe para erro customizado com statusCode
export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

// Função para criar erros customizados
function createHttpError(message: string, statusCode: number) {
    return new HttpError(message, statusCode);
}

export const ConflictError = (message = 'Conflict error.') =>
    createHttpError(message, 409);

export const BadRequestError = (message = 'Bad request.') =>
    createHttpError(message, 400);

export const UnauthorizedError = (message = 'Unauthorized access.') =>
    createHttpError(message, 401);

export const ForbiddenError = (message = 'Forbidden access.') =>
    createHttpError(message, 403);

export const NotFoundError = (message = 'Resource not found.') =>
    createHttpError(message, 404);

export const InternalServerError = (message = 'Internal Server Error.') =>
    createHttpError(message, 500);
