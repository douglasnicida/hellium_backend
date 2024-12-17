import { PrismaClient, Product } from "@prisma/client";
import { CustomReply } from "../../types/fastify.type";

export class ProductService {
    constructor(private prisma: PrismaClient) {}

    async findAll() {
        const products: Product[] = await this.prisma.product.findMany();
        const resContent: CustomReply<Product[]> = {
            payload: products,
        }

        return resContent;
    }

    async findByID(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id: id } });
    }
}