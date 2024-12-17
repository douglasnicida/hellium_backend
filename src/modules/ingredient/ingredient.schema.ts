export const IngredientSchema = {
    $id: 'IngredientSchema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      quantity: { type: 'number' },
      unit: { type: 'string' },
      description: { type: 'string', nullable: true },
      active: { type: 'boolean' },
      recipesIDs: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['id', 'name', 'quantity', 'unit', 'active']
  };