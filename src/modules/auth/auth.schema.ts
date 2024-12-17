import { BaseReplySchema } from "../../types/fastify.type"

export const UserSchema = {
    $id: 'UserSchema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      active: { type: 'boolean' }
    },
    required: ['id', 'name', 'email', 'password', 'active']
  };
  

export const LoginRequestSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
    }
}

export const LoginReplySchema = {
    200: {
        ...BaseReplySchema,
        properties: {
            ...BaseReplySchema.properties,
            payload: {
                access_token: { type: 'string' }
            }
        }
    }
}

export const LoginPostSchema = {
    schema: { 
        body: LoginRequestSchema, 
        response: LoginReplySchema 
    }
}

export const RegisterRequestSchema = {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        name: { type: 'string' }
    }
}

export const RegisterReplySchema = {
    201: {
        ...BaseReplySchema,
        properties: {
            ...BaseReplySchema.properties,
            payload: { type: 'object' }
        }
    }
}

export const RegisterPostSchema = {
    schema: { 
        body: RegisterRequestSchema, 
        response: RegisterReplySchema 
    }
}