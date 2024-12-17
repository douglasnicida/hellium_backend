import { BaseReplySchema } from "../../types/fastify.type";

export const ProductSchema = {
    $id: 'ProductSchema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      price: { type: 'number' },
      stockQuantity: { type: 'integer' },
      active: { type: 'boolean' },
      items: {
        type: 'array',
        items: { $ref: 'ItemSchema' }
      },
      recipe: {
        type: 'object',
        nullable: true,
        $ref: 'RecipeSchema'
      }
    },
    required: ['id', 'name', 'price', 'stockQuantity', 'active']
  };
  

export const FindByIDRequestSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'string'}
    }
}

const FindByIDReplySchema = {
    200: {
        ...BaseReplySchema,
        properties: {
            ...BaseReplySchema.properties,
            payload: ProductSchema
        }
    }
}

export const FindByIDGetSchema = {
    schema: {
        params: FindByIDRequestSchema,
        response: FindByIDReplySchema
    }
}