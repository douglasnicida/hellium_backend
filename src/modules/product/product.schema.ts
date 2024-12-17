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
  
const CreateProductRequestSchema = {
  type: 'object',
  required: ['name', 'price', 'stockQuantity'],
  properties: {
    name: { type: 'string' },
    price: { type: 'number' },
    stockQuantity: { type: 'integer' },
    Recipe: { type: 'object' }
  }
}

const CreateProductReplySchema = {
  201: {
      ...BaseReplySchema,
      properties: {
          ...BaseReplySchema.properties,
          payload: ProductSchema
      }
  }
}

export const CreateProductPostSchema = {
  schema: {
      body: CreateProductRequestSchema,
      response: CreateProductReplySchema
  }
}

const FindByIDRequestSchema = {
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