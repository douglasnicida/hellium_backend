import { IngredientSchema } from "../ingredient/ingredient.schema";
import { ProductSchema } from "../product/product.schema";

export const RecipeSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        ingredients: { 
            type: 'array', 
            items: IngredientSchema
        },
        product: { 
            type: 'object', 
            ...ProductSchema
        }
    },
    required: ['id', 'description', 'product']
};