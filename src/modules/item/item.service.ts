import { PrismaClient, Sale } from "@prisma/client";
import { CreateItemDTO } from "./dto/create-item.dto";
import { ObjectId } from "mongodb";
import { ConflictError, NotFoundError } from "../../handlers/errorHandler";
import { UpdateItemDTO } from "./dto/update-item.dto";
import { SaleService, SaleStatus } from "../sale/sale.service";
import { CreateSaleDTO } from "../sale/dto/create-sale.dto";

export class ItemService {
    constructor(private prisma: PrismaClient, private saleService: SaleService) {}

    async create(createItemDTO: CreateItemDTO) {
        // Verifying if there is already a pending sale with this item for this customer
        const pendingSaleExists = await this.findItemInSale(createItemDTO.customerID, createItemDTO.productID);
        let saleID: ObjectId = (createItemDTO.saleID) ? createItemDTO.saleID : null;
        
        if(pendingSaleExists) {
            throw ConflictError("There is already a pending sale with this item for this customer.");
        }

        // If there is no saleID, create a new sale
        if(saleID) {
            const newSale = {
                amount: createItemDTO.price * createItemDTO.quantity,
                status: SaleStatus.PENDING,
                customer: createItemDTO.customerID
            } as CreateSaleDTO

            saleID = new ObjectId((await this.saleService.create(newSale)).id);
        }

        // Creating the item with the saleID
        const item = await this.prisma.item.create({
            data: {
                ...createItemDTO,
                productID: createItemDTO.productID.toString(),
                saleID: saleID.toString()
            }
        })

        return item;
    }

    async findItemInSale(customerID: ObjectId, productID: ObjectId) {
        const item = await this.prisma.sale.findFirst({
            where: {
                items: {
                    some: {
                        productID: productID.toString(),
                    }
                },
                status: SaleStatus.PENDING,
                customer: { id: customerID.toString() },
            }
        });

        return item ? item : null;
    }

    async findItemByID(id: ObjectId) {
        const item = await this.prisma.item.findUnique({
            where: {
                id: id.toString()
            }
        })

        if(!item) {
            throw NotFoundError("Item not found");
        }

        return item;
    }

    async updateItem(id: ObjectId, updateDTO: UpdateItemDTO) {
        const item = await this.prisma.item.findFirst({
            where: {
                id: id.toString()
            }
        })

        if(!item) {
            throw NotFoundError("Item not found");
        }
        
        const itemInSale = this.findItemInSale(new ObjectId(item.saleID), new ObjectId(item.saleID));

        if(!itemInSale) {
            throw ConflictError("Item does not exist in this sale");
        }

        const updatedItem = await this.prisma.item.update({
            where: {
                id: id.toString()
            },
            data: {
                price: updateDTO.price,
                quantity: updateDTO.quantity
            }
        })

        return updatedItem;
    }
}