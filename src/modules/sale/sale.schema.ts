import { CustomerSchema } from "../costumer/costumer.schema";
import { ItemSchema } from "../item/item.schema";

export const SaleSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        amount: { type: 'number' },
        status: { type: 'string' },
        items: { 
            type: 'array', 
            items: ItemSchema
        },
        customer: { 
            type: 'object', 
            ...CustomerSchema
        }
    },
    required: ['id', 'amount', 'status']
};