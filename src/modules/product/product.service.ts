import { PrismaClient, Product } from "@prisma/client";
import { CustomReply } from "../../types/fastify.type";
import { ConflictError, NotFoundError } from "../../handlers/errorHandler";
import { ObjectId } from "mongodb";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { PaginatedResponse, PaginationParams } from "../../types/pagination.type";

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

    async findAll(pagination: PaginationParams): Promise<CustomReply<PaginatedResponse<Product>>> {
        const { page, size } = pagination;

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                skip: page * size,
                take: size,
            }),
            this.prisma.product.count()
        ])

        const resContent: CustomReply<PaginatedResponse<Product>> = {
            payload: {
                meta: {
                    page: page,
                    size: size,
                    total: total,
                    maxPage: Math.ceil(total / size)
                },
                data: products
            },
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

    async update(id: ObjectId, updateDTO: UpdateProductDTO): Promise<CustomReply<Product>> {
        const product = await this.prisma.product.findFirst({where: { id: id.toString() }});

        if(!product) {
            throw NotFoundError(`Product with ID ${id} not found.`);
        }

        if(updateDTO.name) {
            const existentProduct = await this.prisma.product.findFirst({where: { name: updateDTO.name }});
            
            if(existentProduct && existentProduct.id !== product.id) {
                throw ConflictError('Product name already exists.');
            }
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id: product.id.toString() },
            data: updateDTO
        })

        const resContent: CustomReply<Product> = {
            message: `Product ${updatedProduct.name} updated successfully.`,
            payload: updatedProduct
        } 

        return resContent;
    }
}