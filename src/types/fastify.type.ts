export const HttpCodes = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;
export type HttpCodes = typeof HttpCodes[keyof typeof HttpCodes];

export const BaseReplySchema = { 
    type: 'object',
    properties: {
        status: { type: 'integer' },
        message: { type: 'string' },
        payload: { type: 'object' },
    }
}

export interface CustomReply<T = unknown> {
    status?: HttpCodes;
    message?: string;
    payload?: T;
}