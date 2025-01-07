import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ItemService } from "./item.service";
import { prisma } from "../../database/prisma-client";
import { CustomReply, FindByIDRequestParam } from "../../types/fastify.type";
import { Item } from "@prisma/client";
import { objectIDValidation } from "../../middlewares/objectIdMiddleware";
import { CreatePostSchema, FindByIDSchema } from "./item.schema";
import { CreateItemDTO } from "./dto/create-item.dto";
import { UpdateItemDTO } from "./dto/update-item.dto";
import { SaleService } from "../sale/sale.service";

interface UpdateItemPostRequest {
    Body: UpdateItemDTO;
    Params: FindByIDRequestParam['Params'];
}

export const itemsRoute = (fastifyApp: FastifyInstance, opts: any, done: any) => {
    const itemService = new ItemService(prisma, new SaleService(prisma));

    // Create Item
    fastifyApp.post('/', CreatePostSchema, async (req: FastifyRequest, res: FastifyReply): Promise<CustomReply<Item>> => {
        const body = req.body as CreateItemDTO;
        const createdItem = await itemService.create(body);

        const resContent = {
            message: "Item created successfully",
            payload: createdItem
        }

        return res.status(201).customSend(resContent);
    });

    // Find Item by ID
    fastifyApp.get('/:id', {preValidation: objectIDValidation, schema: FindByIDSchema.schema}, async (req: FastifyRequest, res: FastifyReply): Promise<CustomReply<Item>> => {
        const params = req.params as FindByIDRequestParam['Params'];

        const item = await itemService.findItemByID(params.id);

        const resContent = {
            message: "Item found successfully",
            payload: item
        };

        return res.status(200).customSend(resContent);
    });

    // Update Item
    fastifyApp.put('/:id', {preValidation: objectIDValidation, schema: FindByIDSchema.schema}, async (req: FastifyRequest, res: FastifyReply): Promise<CustomReply<Item>> => {
        const params = req.params as UpdateItemPostRequest['Params'];
        const body = req.body as UpdateItemPostRequest['Body'];

        const updatedItem = await itemService.updateItem(params.id, body);

        const resContent = {
            message: "Item updated successfully",
            payload: updatedItem
        }
        
        return res.status(200).customSend(resContent);
    });
    
    done();
}
    