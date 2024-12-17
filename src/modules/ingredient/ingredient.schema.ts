import { RecipeSchema } from "../recipe/recipe.schema";

export const IngredientSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        quantity: { type: 'number' },
        unit: { type: 'string' },
        description: { type: 'string', nullable: true },
        active: { type: 'boolean' },
        recipes: { 
            type: 'array', 
            items: RecipeSchema
        }
    },
    required: ['id', 'name', 'quantity', 'unit', 'active']
};