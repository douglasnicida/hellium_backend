export const CustomerSchema = {
    $id: 'CustomerSchema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      companyName: { type: 'string', nullable: true },
      personName: { type: 'string', nullable: true },
      active: { type: 'boolean' },
      sales: {
        type: 'array',
        items: { $ref: 'SaleSchema' }
      }
    },
    required: ['id', 'active']
  };
  