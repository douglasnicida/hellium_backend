import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { prisma } from '../../database/prisma-client';
import { ObjectId } from 'mongodb';

// TODO: terminar de fazer os testes e entender um pouco mais de como funciona a parte do mock no vitest

// Mocking database
vi.mock('../../database/prisma-client', () => ({
    prisma: {
        product: {
            findFirst: vi.fn(),
            create: vi.fn(),
            findMany: vi.fn(),
            count: vi.fn(),
        }
    }
}));

describe('ProductService', () => {
    let productService: ProductService;
    let product: Product;
    let id: ObjectId;
    
    beforeEach(async () => {

        productService = new ProductService(prisma);

        id = new ObjectId()
        product = {
            id: id.toString(),
            name: 'Test Product',
            price: 5,
            stockQuantity: 10,
            img: '',
            active: true,
        };

        (prisma.product.create as ReturnType<typeof vi.fn>).mockResolvedValue(product);

        const createdProduct = await productService.create(product);
        
        expect(createdProduct).toEqual(product);
    });

    it('should create a product', async () => {
        (prisma.product.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
        
        expect(prisma.product.findFirst).toHaveBeenCalledWith({ where: { name: product.name } });
        expect(prisma.product.create).toHaveBeenCalledWith({ data: product });
    });

    it('should get a product by id', async () => {
        const mockFindByID = vi.spyOn(productService, 'findByID').mockResolvedValue(product);

        const foundProduct = await productService.findByID(new ObjectId(product.id));

        expect(foundProduct).toEqual(product);
        expect(mockFindByID).toHaveBeenCalledWith(id);
    });

    it('should update a product', async () => {

        const newData = { price: 150 };

        const updatedProduct = await productService.update(id, newData);
        
        expect(updatedProduct.price).toBe(150);
    });

    it('should inactive a product', async () => {

        const newData = { active: false };

        const updatedProduct = await productService.update(new ObjectId(id), newData);

        expect(updatedProduct.active).toBe(false);
    });
});