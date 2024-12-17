import { PrismaClient, Product } from "@prisma/client";
import { CustomReply } from "../../types/fastify.type";
import { ConflictError, NotFoundError } from "../../handlers/errorHandler";
import { ObjectId } from "mongodb";
import { CreateProductDTO } from "./dto/createProductDTO";

export class ProductService {
    constructor(private prisma: PrismaClient) {}

    // fazer os service de criação de produto e passar a usar dto
    async create(createDTO: CreateProductDTO): Promise<CustomReply<Product>> {
        const product = await this.prisma.product.findFirst({where: {name: createDTO.name}});

        if(product) {
            throw ConflictError('This product already exists.')
        }

        const newProduct = await this.prisma.product.create({
            data: createDTO
        })

        const resContent: CustomReply<Product> = {
            message: `Product ${newProduct.name} created successfully.`,
            payload: newProduct
        }
        
        return resContent;
    }

    async findAll(): Promise<CustomReply<Product[]>> {
        const products: Product[] = await this.prisma.product.findMany();
        const resContent: CustomReply<Product[]> = {
            payload: products,
        }

        return resContent;
    }

    async findByID(id: ObjectId): Promise<CustomReply<Product>> {

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