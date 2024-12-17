import { Recipe } from "@prisma/client";

export interface CreateProductDTO {
    name: string;
    price: number;
    stockQuantity: number;
    Recipe?: Recipe;
}