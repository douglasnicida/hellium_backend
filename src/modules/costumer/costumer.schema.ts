import { SaleSchema } from "../sale/sale.schema";

export const CustomerSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        companyName: { type: 'string', nullable: true },
        personName: { type: 'string', nullable: true },
        active: { type: 'boolean' },
        sales: { 
            type: 'array', 
            items: SaleSchema
        }
    },
    required: ['id', 'active']
};