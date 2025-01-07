import { BaseReplySchema } from "../../types/fastify.type";

export const ItemSchema = {
    $id: 'ItemSchema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      quantity: { type: 'integer' },
      price: { type: 'number' },
      productID: { type: 'string' },
      saleID: { type: 'string' }
    },
    required: ['id', 'quantity', 'price', 'productID', 'saleID']
};

export const FindByIDRequestSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }
  }
}
export const FindByIDReplySchema = {
  200: {
    ...BaseReplySchema,
    properties: {
      ...BaseReplySchema.properties,
      payload: ItemSchema
    }
  }
}
export const FindByIDSchema = {
  schema: {
    params: FindByIDRequestSchema, 
    response: FindByIDReplySchema
  }
}


export const CreateRequestSchema = {
  type: 'object',
  required: ['quantity', 'price', 'productID', 'saleID'],
  properties: {
    price: { type: 'number' },
    quantity: { type: 'integer' },
    productID: { type: 'string' },
    saleID: { type: 'string' }
  }
}
export const CreateReplySchema = {
  201: {
    ...BaseReplySchema,
    properties: {
      ...BaseReplySchema.properties,
      payload: ItemSchema
    }
  }
}
export const CreatePostSchema = {
  schema: {
    body: CreateRequestSchema, 
    response: CreateReplySchema
  }
}

export const UpdateRequestSchema = {
  type: 'object',
  oneOf: [
    { required: ['quantity'] },
    { required: ['price'] }
  ],
  properties: {
    price: { type: 'number' },
    quantity: { type: 'integer' }
  }
}
export const UpdateParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }
  }
}
export const UpdateReplySchema = {
  200: {
    ...BaseReplySchema,
    properties: {
      ...BaseReplySchema.properties,
      payload: ItemSchema
    }
  }
}
export const UpdatePutSchema = {
  schema: {
    body: UpdateRequestSchema,
    params: UpdateParamsSchema,
    response: UpdateReplySchema
  }
}