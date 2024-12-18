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
  

const CreateRequestSchema = {
  type: 'object',
  required: ['name', 'price', 'stockQuantity'],
  properties: {
    name: { type: 'string' },
    price: { type: 'number' },
    stockQuantity: { type: 'integer' },
    Recipe: { type: 'object' }
  }
}
const CreateReplySchema = {
  201: {
      ...BaseReplySchema,
      properties: {
          ...BaseReplySchema.properties,
          payload: ProductSchema
      }
  }
}
export const CreatePostSchema = {
  schema: {
      body: CreateRequestSchema,
      response: CreateReplySchema
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


const UpdateBodyRequestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    price: { type: 'number' },
    stockQuantity: { type: 'integer' },
    Recipe: { type: 'object' }
  }
}
const UpdateParamsRequestSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  }
}
const UpdateReplySchema = {
  200: {
      ...BaseReplySchema,
      properties: {
          ...BaseReplySchema.properties,
          payload: ProductSchema
      }
  }
}
export const UpdatePatchSchema = {
      body: UpdateBodyRequestSchema,
      params: UpdateParamsRequestSchema,
      response: UpdateReplySchema
}

