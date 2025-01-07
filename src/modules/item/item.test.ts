import { beforeEach, describe, expect, it, vi } from "vitest";
import { ItemService } from "./item.service";
import { prisma } from "../../database/prisma-client";
import { ObjectId } from "mongodb";
import { Item } from "@prisma/client";

// Mocking database
vi.mock('../../database/prisma-client', () => ({
    prisma: {
        item: {
            findFirst: vi.fn(),
            create: vi.fn(),
            findMany: vi.fn(),
            count: vi.fn(),
        }
    }
}));

describe('ItemService', () => {

    let itemService: ItemService;
    let item: Item;
    let id: ObjectId;

    beforeEach(async () => {
        vi.resetAllMocks();
    
    
        itemService = new ItemService(prisma);
        id = new ObjectId();

        item = {
            id: id.toString(),
            saleID: new ObjectId().toString(),
            productID: new ObjectId().toString(),
            quantity: 5,
            price: 10
        };

        (prisma.item.create as ReturnType<typeof vi.fn>).mockResolvedValue(item);

        const createdItem = await itemService.create({
            ...item,
            saleID: new ObjectId(item.saleID),
            productID: new ObjectId(item.productID)
        });

        expect(createdItem).toEqual({ 
            message: "Item created successfully", 
            payload: item 
        });
    });

    it('should get an item by id', async () => {
        (prisma.item.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(item);

        const foundItem = await itemService.findItemByID(id);

        expect(foundItem.payload).toEqual(item);
        expect(prisma.item.findFirst).toHaveBeenCalledWith({ where: { id: id.toString() } });
    });

    it('should throw an error if item not found', async () => {
        (prisma.item.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

        try {
            await itemService.findItemByID(id);
        } catch (error) {
            expect(error.message).toEqual("Item not found");
        }
    });

    it('should update an item', async () => {
        const updateDTO = {
            quantity: 10,
            price: 20
        };

        (prisma.item.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(item);

        const updatedItem = await itemService.updateItem(id, updateDTO);

        expect(updatedItem.payload).toEqual({
            ...item,
            ...updateDTO
        });
        expect(prisma.item.findFirst).toHaveBeenCalledWith({ where: { id: id.toString() } });
    });

    
});