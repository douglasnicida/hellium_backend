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
    async create(createDTO: CreateProductDTO): Promise<Product> {
        const product = await this.prisma.product.findFirst({where: {name: createDTO.name}});

        if(product) {
            throw ConflictError('This product already exists.')
        }

        const newProduct = await this.prisma.product.create({
            data: createDTO
        })
        
        
        return newProduct;
    }

    async findAll(pagination: PaginationParams): Promise<PaginatedResponse<Product>> {
        const { page, size } = pagination;

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                skip: page * size,
                take: size,
            }),
            this.prisma.product.count()
        ])

        const paginatedContent: PaginatedResponse<Product> = {    
            meta: {
                page: page,
                size: size,
                total: total,
                maxPage: Math.ceil(total / size)
            },
            data: products
        }

        return paginatedContent;
    }

    async findByID(id: ObjectId): Promise<Product> {

        const product = await this.prisma.product.findFirst({ where: { id: id.toString() } });

        if(!product) {
            throw NotFoundError('No product found.');
        }

        return product;
    }

    async update(id: ObjectId, updateDTO: UpdateProductDTO): Promise<Product> {
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

        return updatedProduct;
    }
}