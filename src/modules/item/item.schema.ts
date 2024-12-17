import { ProductSchema } from "../product/product.schema";
import { SaleSchema } from "../sale/sale.schema";

export const ItemSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        quantity: { type: 'integer' },
        price: { type: 'number' },
        product: { 
            type: 'object', 
            ...ProductSchema
        },
        Sale: { 
            type: 'object', 
            ...SaleSchema
        }
    },
    required: ['id', 'quantity', 'price']
};