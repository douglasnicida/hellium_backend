import { PrismaClient, Product } from "@prisma/client";
import { CustomReply } from "../../types/fastify.type";
import { NotFoundError } from "../../handlers/errorHandler";
import { ObjectId } from "mongodb";

export class ProductService {
    constructor(private prisma: PrismaClient) {}

    async findAll() {
        const products: Product[] = await this.prisma.product.findMany();
        const resContent: CustomReply<Product[]> = {
            payload: products,
        }

        return resContent;
    }

    async findByID(id: ObjectId) {

        const product = await this.prisma.product.findFirst({ where: { id: id.toString() } });

        if(!product) {
            throw NotFoundError('No product found.');
        }

        const resContent: CustomReply<Product> = {
            payload: product,
        }

        return resContent;
    }
}