import { ObjectId } from "mongodb";

export class CreateItemDTO {
    quantity: number;
    price: number;
    productID: ObjectId;
    saleID?: ObjectId;
    customerID: ObjectId;
}