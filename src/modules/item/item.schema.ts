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
  