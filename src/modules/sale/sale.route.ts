
import { FastifyInstance } from "fastify";
import { CustomReply } from "../../types/fastify.type";
import { Sale } from "@prisma/client";
import { prisma } from "../../database/prisma-client";
import { SaleService } from "./sale.service";
import { CreateSaleDTO } from "./dto/create-sale.dto";

const salesRoute = (app: FastifyInstance, opts: any, done: any) => {
    
    const saleService = new SaleService(prisma);

    // Create a Sale (fazer schema))
    app.post("/sales", async (req, res) => {
        
        const createDTO = req.body as CreateSaleDTO;

        const sale = await saleService.create(createDTO);
        
        const customReply: CustomReply<Sale> = {
            message: "Sale created successfully",
            payload: sale,
        }

        return customReply;
    });

    app.get("/sales", async (req, res) => {
        return { sales: [] };
    });
    
    app.get("/sales/:id", async (req, res) => {
        return { sale: {} };
    });
    
    app.put("/sales/:id", async (req, res) => {
        return { sale: {} };
    });
    
    app.delete("/sales/:id", async (req, res) => {
        return { sale: {} };
    });
    
    done();
}

export default salesRoute;