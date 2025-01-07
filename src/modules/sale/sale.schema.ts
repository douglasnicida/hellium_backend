export const SaleSchema = {
  $id: 'SaleSchema',
  type: 'object',
  properties: {
    id: { type: 'string' },
    amount: { type: 'number' },
    status: { type: 'string' },
    items: {
      type: 'array',
      items: { $ref: 'ItemSchema' }
    },
    customer: {
      type: 'object',
      $ref: 'CustomerSchema'
    }
  },
  required: ['id', 'amount', 'status', 'items', 'customer']
};
  
