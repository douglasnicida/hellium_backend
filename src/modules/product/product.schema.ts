import { BaseReplySchema } from "../../types/fastify.type";
import { ItemSchema } from "../item/item.schema";
import { RecipeSchema } from "../recipe/recipe.schema";

export const ProductSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        price: { type: 'number' },
        stockQuantity: { type: 'integer' },
        active: { type: 'boolean' },
        items: { 
            type: 'array', 
            items: ItemSchema
        },
        recipe: { 
            type: 'object', 
            ...RecipeSchema
        }
    },
    required: ['id', 'name', 'price', 'stockQuantity', 'active']
};

export const FindByIDReplySchema = {
    200: {
        ...BaseReplySchema,
        properties: {
            ...BaseReplySchema.properties,
            payload: ProductSchema
        }
    }
}