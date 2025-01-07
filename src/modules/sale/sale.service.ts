import { PrismaClient, Sale } from "@prisma/client";
import { CreateSaleDTO } from "./dto/create-sale.dto";
import { CustomReply } from "../../types/fastify.type";
import { ConflictError } from "../../handlers/errorHandler";

export const SaleStatus = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
}

export class SaleService {
    constructor( private prisma: PrismaClient ) {}

    async create(createSaleDTO: CreateSaleDTO): Promise<Sale> {
        const newSale = {
            amount: createSaleDTO.amount,
            status: createSaleDTO.status,
            customerID: createSaleDTO.customer.toString(),
        };

        const sale = await this.prisma.sale.create({
            data: newSale,
        });
        
        return sale;
    }

}