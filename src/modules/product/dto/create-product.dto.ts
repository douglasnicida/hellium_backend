import { Recipe } from "@prisma/client";

export class CreateProductDTO {
    name: string;
    price: number;
    stockQuantity: number;
    img?: string;
    Recipe?: Recipe;
    active?: boolean;
}