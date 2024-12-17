export const RecipeSchema = {
    $id: 'RecipeSchema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      description: { type: 'string' },
      ingredients: {
        type: 'array',
        items: { $ref: 'IngredientSchema' }
      },
      productID: { type: 'string' }
    },
    required: ['id', 'description', 'productID']
  };