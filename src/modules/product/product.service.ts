import { PrismaClient, Product } from "@prisma/client";

export class ProductService {
    constructor(private prisma: PrismaClient) {}

    async findAll() {
        const products: Product[] = await this.prisma.product.findMany();
        const resContent = {
            payload: products,
        }

        return resContent;
    }
}